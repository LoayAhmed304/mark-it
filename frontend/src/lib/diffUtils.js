import { diff_match_patch } from 'diff-match-patch';

const dmp = new diff_match_patch();

export function createPatch(oldText, newText) {
  const diffs = dmp.diff_main(oldText, newText);
  dmp.diff_cleanupEfficiency(diffs);
  const patches = dmp.patch_make(oldText, diffs);
  return dmp.patch_toText(patches);
}

export function applyPatch(oldText, patchText) {
  const patches = dmp.patch_fromText(patchText);
  const [newText, results] = dmp.patch_apply(patches, oldText);
  const success = results.every((result) => result);
  return { newText, success };
}
