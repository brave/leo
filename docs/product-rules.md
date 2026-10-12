# Beyond tokens: product rules

Product-level rules for products built on Leo. Builds on [AGENTS.md](../AGENTS.md).

These are the product-level rules for interaction, writing, privacy and AI
surfaces. Where a repository's guidelines are more specific, follow the
repository.

## Principles

- **Quiet, neutral chrome.** The accent marks primary actions, focus,
  selection and links only. Status colour is used only for status.
- **Every element has a purpose.** Remove text that repeats state the UI
  already shows. A note sits with its item, an input problem at the input,
  and an application error is a toast or the platform's equivalent.
- **Nothing approves for the person.** No shortcut, default focus or
  auto-advance answers a permission, privacy or payment decision.
- **Trust markings are never colour alone.** They also have a text label
  or a border that survives high contrast and forced colours.
- **Fast.** Typing, scrolling and opening a menu never wait on the rest of
  the UI.

## Interaction

- **Undo over confirmation.** Confirm only what cannot be undone. The
  confirmation names the consequence ("Delete 12 files"), not "OK", and
  default focus is on the choice that keeps things as they are.
- **Loading and network.** Use a skeleton sized like the content when its
  shape is known, a determinate bar when the length is known, and a
  labelled spinner otherwise. Offline is a state: say so, keep what is
  loaded, offer a retry, and do not discard what was typed.
- **Forms.** Labels stay visible and a placeholder is never the label.
  Validate on leaving a field or on submit. Errors sit at the field, are
  linked to it for assistive technology, and focus moves to the first one.
  Do not disable submit to signal invalid input, and never block paste or
  autofill.
- **Focus.** It moves into a dialog or menu, stays inside a modal, and
  returns to the opener. It is always visible, and new content does not
  steal it. Nothing is available only on hover.
- **Shortcuts** do not override browser or OS ones, each has a visible
  control, tooltips show the platform's keys, and Esc closes one layer at a
  time (it stops generation first).

## Writing and localization

- **Plain, calm and honest.** Address the person as "you" and Brave as
  "Brave". No exclamation marks, hype, guilt or false urgency. Buttons are
  verbs that name the result. Errors say what happened, then what to do.
- **Prompts** say who is asking, for what, and what happens on each choice.
  Declining is as easy and as clearly worded as accepting.
- **Strings** live in the platform's resources (GRD/GRDP in brave-core,
  `strings.xml`, string catalogs) in US English. They are whole sentences
  with placeholders, use ICU plurals, and have a translator description.
  Numbers, dates and times use locale APIs. There is no text in images.

## Privacy and consent

- **Off until chosen.** A feature that sends data off the device is off
  until the person turns it on, never by an update or a pre-checked box.
  Say what is sent, to whom, why, and whether it is stored.
- **Equal choices, asked once.** Accept and decline have the same
  prominence. Ask when the feature is first used, respect a "no", and keep
  every choice changeable in settings.
- **No dark patterns.** Measure only through the approved privacy-preserving
  analytics (P3A in the browser), with no identifiers, content or URLs.

## Agent and AI surfaces

- **Label AI content** and say where the model runs.
- **Stream in place.** Scroll follows only if the person is at the bottom.
  A visible stop control is always available and keeps what was produced.
- **Show the work.** Say what the agent is doing in plain words, cite
  sources where the claim is made, and never present an error or refusal
  as an answer.
- **Ask before acting** with the exact action, target and data, and with
  specific choices ("Allow once", "Always allow on example.com", "Deny").
  Default focus is never on an allow choice, and nothing allows
  automatically, even after a timeout.
- **Screen readers** hear a reply announced once, not token by token.
  Permission prompts take focus on the least permissive choice.
- **Untrusted content** (pages, emails, tool output) sits in a container
  with a border and a text label naming its source, never looks like UI,
  and trust labels are drawn by the surface, never from model or page output.
