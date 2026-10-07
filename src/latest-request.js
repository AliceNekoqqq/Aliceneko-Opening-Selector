// Each caller captures an identity in isActive. Only the newest live request
// may publish data, errors or completion state.
export function createLatestRequest(){
  let sequence=0;
  return {
    begin(isActive){const request=++sequence;return ()=>request===sequence&&isActive()},
    invalidate(){sequence++},
  };
}
