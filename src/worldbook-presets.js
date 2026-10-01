/* Safe, character-bound worldbook entry snapshots for per-opening presets. */
const uidKey = value => value == null || String(value) === '' ? null : String(value);

function normalizeEntry(entry) {
  const uid = uidKey(entry?.uid ?? entry?.id);
  if (uid == null || typeof entry?.enabled !== 'boolean') return null;
  return {
    uid: entry.uid ?? entry.id,
    name: String(entry.name || entry.comment || `条目 ${uid}`).slice(0, 160),
    enabled: entry.enabled,
  };
}

function withEnabledState(entry, enabled) {
  if (Object.prototype.hasOwnProperty.call(entry, 'enabled') || !Object.prototype.hasOwnProperty.call(entry, 'disable')) {
    return { ...entry, enabled };
  }
  return { ...entry, disable: !enabled };
}

export function normalizeWorldbookPreset(input) {
  if (!input || typeof input !== 'object' || !Array.isArray(input.books)) return null;
  const books = [];
  const seenBooks = new Set();
  for (const book of input.books.slice(0, 128)) {
    const name = typeof book?.name === 'string' ? book.name.trim().slice(0, 300) : '';
    if (!name || seenBooks.has(name) || !Array.isArray(book.entries)) continue;
    seenBooks.add(name);
    const seenUids = new Set();
    const entries = [];
    for (const raw of book.entries.slice(0, 10000)) {
      const entry = normalizeEntry(raw);
      const key = entry && uidKey(entry.uid);
      if (!entry || seenUids.has(key)) continue;
      seenUids.add(key);
      entries.push(entry);
    }
    if (entries.length) books.push({ name, entries });
  }
  return books.length ? { version: 1, books } : null;
}

export function captureWorldbookPreset(books) {
  const snapshot = normalizeWorldbookPreset({
    version: 1,
    books: (Array.isArray(books) ? books : []).map(book => ({
      name: book.name,
      entries: (Array.isArray(book.entries) ? book.entries : []).map(entry => ({
        uid: entry.uid ?? entry.id,
        name: entry.name || entry.comment || '',
        enabled: entry.enabled !== false && entry.disable !== true,
      })),
    })),
  });
  if (!snapshot) throw Error('没有可记录开关状态的角色世界书条目');
  return snapshot;
}

export function createWorldbookPresetManager(getSources, getCard) {
  function sources() {
    const value = typeof getSources === 'function' ? getSources() : getSources;
    return (Array.isArray(value) ? value : [value]).filter(Boolean);
  }
  function find(method) {
    const owner = sources().find(source => typeof source?.[method] === 'function');
    return owner ? owner[method].bind(owner) : null;
  }
  async function readBindings() {
    const calls = [
      find('getCharWorldbookNames') && (() => find('getCharWorldbookNames')('current')),
      find('getCharLorebooks') && (() => find('getCharLorebooks')({ name: 'current', type: 'all' })),
      find('getCurrentCharPrimaryLorebook') && (async () => ({ primary: await find('getCurrentCharPrimaryLorebook')(), additional: [] })),
    ].filter(Boolean);
    for (const get of calls) {
      try {
        const result = await get();
        if (!result || typeof result !== 'object' || !('primary' in result || 'additional' in result)) continue;
        return [...new Set([result.primary, ...(Array.isArray(result.additional) ? result.additional : [])]
          .filter(name => typeof name === 'string' && name.trim()).map(name => name.trim()))];
      } catch {}
    }
    const card = getCard?.(), data = card?.data || card || {};
    const primary = data.extensions?.world ?? card?.extensions?.world;
    if (typeof primary === 'string' && primary.trim()) return [primary.trim()];
    throw Error(calls.length ? '无法读取当前角色绑定的世界书' : '酒馆助手未提供角色世界书绑定接口');
  }
  async function read() {
    const bindings = await readBindings();
    const getWorldbook = find('getWorldbook');
    const getLorebookEntries = find('getLorebookEntries');
    const books = [], warnings = [];
    if (bindings.length && !getWorldbook && !getLorebookEntries) {
      throw Error('酒馆助手未提供世界书条目读取接口');
    }
    for (const name of bindings) {
      let loaded = false, error = '';
      for (const get of [getWorldbook, getLorebookEntries].filter(Boolean)) {
        try {
          const entries = await get(name);
          if (!Array.isArray(entries)) throw Error('返回格式异常');
          books.push({ name, entries });
          loaded = true;
          break;
        } catch (cause) { error = String(cause?.message || cause).slice(0, 140); }
      }
      if (!loaded) warnings.push(`“${name}”读取失败${error ? `：${error}` : ''}`);
    }
    if (bindings.length && !books.length) throw Error(`角色绑定的世界书无法读取${warnings.length ? `：${warnings.join('；')}` : ''}`);
    return { books, bindings, warnings, entryCount: books.reduce((sum, book) => sum + book.entries.length, 0) };
  }
  function updateMethod() {
    const updateWith = find('updateWorldbookWith');
    if (updateWith) return async (name, states, sourceEntries) => {
      await updateWith(name, entries => {
        const found = new Set();
        const updated = entries.map(entry => {
          const key = uidKey(entry.uid ?? entry.id);
          if (!states.has(key)) return entry;
          found.add(key);
          return { ...entry, enabled: states.get(key) };
        });
        if ([...states.keys()].some(key => !found.has(key))) throw Error(`世界书“${name}”的条目已变化`);
        return updated;
      }, { render: 'immediate' });
    };
    const replaceWorldbook = find('replaceWorldbook');
    if (replaceWorldbook) return async (name, states, sourceEntries) => {
      const found = new Set();
      const updated = sourceEntries.map(entry => {
        const key = uidKey(entry.uid ?? entry.id);
        if (!states.has(key)) return entry;
        found.add(key);
        return withEnabledState(entry, states.get(key));
      });
      if ([...states.keys()].some(key => !found.has(key))) throw Error(`世界书“${name}”的条目已变化`);
      await replaceWorldbook(name, updated, { render: 'immediate' });
    };
    const setEntries = find('setLorebookEntries');
    if (setEntries) return async (name, states, sourceEntries) => {
      const byUid = new Map(sourceEntries.map(entry => [uidKey(entry.uid ?? entry.id), entry]));
      const updates = [...states].map(([uid, enabled]) => {
        const current = byUid.get(uid);
        if (!current) throw Error(`世界书“${name}”的条目已变化`);
        return Object.prototype.hasOwnProperty.call(current, 'disable') && !Object.prototype.hasOwnProperty.call(current, 'enabled')
          ? { uid: current.uid ?? current.id, disable: !enabled }
          : { uid: current.uid ?? current.id, enabled };
      });
      await setEntries(name, updates);
    };
    const replaceLorebookEntries = find('replaceLorebookEntries');
    if (replaceLorebookEntries) return async (name, states, sourceEntries) => {
      const found = new Set();
      const updated = sourceEntries.map(entry => {
        const key = uidKey(entry.uid ?? entry.id);
        if (!states.has(key)) return entry;
        found.add(key);
        return withEnabledState(entry, states.get(key));
      });
      if ([...states.keys()].some(key => !found.has(key))) throw Error(`世界书“${name}”的条目已变化`);
      await replaceLorebookEntries(name, updated, { render: 'immediate' });
    };
    return null;
  }
  async function apply(rawPreset) {
    const preset = normalizeWorldbookPreset(rawPreset);
    if (!preset) throw Error('这个开场还没有有效的世界书预设');
    const current = await read();
    if (current.warnings.length) throw Error(`角色绑定的世界书未能全部读取，已停止切换：${current.warnings.join('；')}`);
    const byName = new Map(current.books.map(book => [book.name, book]));
    const plans = preset.books.map(saved => {
      const book = byName.get(saved.name);
      if (!book) throw Error(`世界书“${saved.name}”当前未绑定或无法读取，请在作者设置中重新记录此开场的预设`);
      const currentByUid = new Map();
      for (const entry of book.entries) {
        const key = uidKey(entry.uid ?? entry.id);
        if (key == null) continue;
        if (currentByUid.has(key)) throw Error(`世界书“${saved.name}”存在重复条目编号，已停止切换以避免误改`);
        currentByUid.set(key, entry);
      }
      const desired = new Map(saved.entries.map(entry => [uidKey(entry.uid), entry.enabled]));
      const before = new Map();
      for (const [uid] of desired) {
        const found = currentByUid.get(uid);
        if (!found) throw Error(`世界书“${saved.name}”中的条目已删除或编号变化，请重新记录此开场的预设`);
        before.set(uid, found.enabled !== false && found.disable !== true);
      }
      return { name: saved.name, entries: book.entries, desired, before };
    });
    const configuredBooks = new Set(preset.books.map(book => book.name));
    const unconfiguredBindings = current.bindings.filter(name => !configuredBooks.has(name));
    if (unconfiguredBindings.length) throw Error(`角色新增了尚未记录到此开场的绑定世界书：${unconfiguredBindings.join('、')}；请重新记录预设`);
    const write = updateMethod();
    if (!write) throw Error('当前酒馆助手没有可用的世界书条目写入接口');
    const changed = plans.filter(plan => [...plan.desired].some(([uid, enabled]) => plan.before.get(uid) !== enabled));
    const attempted = [];
    try {
      for (const plan of changed) {
        attempted.push(plan);
        await write(plan.name, plan.desired, plan.entries);
      }
    } catch (cause) {
      const rollbackErrors = [];
      for (const plan of attempted.reverse()) {
        try { await write(plan.name, plan.before, plan.entries); }
        catch (error) { rollbackErrors.push(`${plan.name}：${String(error?.message || error)}`); }
      }
      const detail = rollbackErrors.length ? `；自动恢复也失败（${rollbackErrors.join('；')}）` : '；已恢复切换前状态';
      throw Error(`切换世界书失败：${String(cause?.message || cause)}${detail}`);
    }
    let rolledBack = false;
    return {
      changedBooks: changed.length,
      changedEntries: changed.reduce((sum, plan) => sum + [...plan.desired].filter(([uid, enabled]) => plan.before.get(uid) !== enabled).length, 0),
      rollback: async () => {
        if (rolledBack) return;
        const errors = [];
        for (const plan of [...changed].reverse()) {
          try { await write(plan.name, plan.before, plan.entries); }
          catch (error) { errors.push(`${plan.name}：${String(error?.message || error)}`); }
        }
        rolledBack = true;
        if (errors.length) throw Error(errors.join('；'));
      },
    };
  }
  return { read, apply };
}
