import { createClient } from '@blinkdotnew/sdk';

export const blink = createClient({
  projectId: "bill-pdf-tool-flzu8tze",
  publishableKey: "blnk_pk_nz-CZfSs3tYNefm6VNPazOHDjD2D-dCs",
  auth: { mode: 'managed' },
});
