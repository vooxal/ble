import { fromEvent  } from 'rxjs';
import { tap, ignoreElements, filter } from 'rxjs/operators';
import { Epic } from 'epix';

import { isShortcut } from 'src/utils/event';

export const copy: Epic = (action$, { store, app }) => {
	// it's very important to use app.view here, if document.body was used
	// it would prevent using text fields normally etc
	return fromEvent<KeyboardEvent>(app.view, 'keydown').pipe(
		filter((ev) => ev.code === 'KeyC' && isShortcut(ev) && store.editor.selection.size > 0),
		tap(() => {
			store.editor.copy();
		}),
		ignoreElements(),
	);
};

export const cut: Epic = (action$, { store, app }) => {
	// it's very important to use app.view here, if document.body was used
	// it would prevent using text fields normally etc
	return fromEvent<KeyboardEvent>(app.view, 'keydown').pipe(
		filter((ev) => ev.code === 'KeyX' && isShortcut(ev) && store.editor.selection.size > 0),
		tap(() => {
			store.editor.cut();
		}),
		ignoreElements(),
	);
};

export const paste: Epic = (action$, { store }) => {
	return fromEvent<ClipboardEvent>(window, 'paste').pipe(
		filter(({ target, clipboardData }) => target === window.document.body && !!clipboardData),
		tap(({ clipboardData }) => {
			Array.from(clipboardData?.items || [])
				.filter(({ type }) => type === 'text/plain')
				.forEach((item) => {
					item.getAsString((clipboardContent) => {
						store.editor.paste(clipboardContent);
					});
				});
		}),
		ignoreElements(),
	);
};
