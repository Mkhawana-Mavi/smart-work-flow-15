# Dark and light mode

## What will change
- Add a compact sun/moon theme button to the desktop sidebar and mobile header.
- Start with the visitor’s system preference, then remember their selected theme in the browser.
- Apply the theme before the page appears to avoid a visible color flash.
- Keep all existing pages and workflows unchanged.

## Technical details
- Add a small reusable theme toggle component using the existing button and color tokens.
- Initialize and persist the `dark` class on the document root.
- Verify the switch on desktop and mobile, including after a page reload.
