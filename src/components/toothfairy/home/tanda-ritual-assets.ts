export const TANDA_RITUAL_ASSET_VERSION = 34;

const version = TANDA_RITUAL_ASSET_VERSION;
const basePath = '/toothfairy/animation';
const stem = `${basePath}/tfn-tanda-hero-integrated`;

export const tandaRitualAssets = {
  version,
  mp4: `${stem}-loop-v${version}.mp4?v=${version}`,
  webm: `${stem}-loop-v${version}.webm?v=${version}`,
  poster: `${stem}-poster-v${version}.webp?v=${version}`,
  reviewPage: `${stem}-v${version}-review.html`,
};
