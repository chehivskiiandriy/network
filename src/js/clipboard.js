import * as clipboard from 'clipboard-polyfill';

export async function writeTextToClipboard(string) {
  await clipboard.writeText(string);
}
