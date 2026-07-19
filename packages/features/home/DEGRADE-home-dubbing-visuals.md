# home-dubbing-visuals — Degrade notes

- **Header history icon**: Flutter uses `Icons.history_rounded`; RN omits (notification asset wired instead).
- **Section copy**: RN keeps existing Chinese labels (e.g. 「最近学习」「达人秀场」) vs Flutter 「最近在学」「新手赛场」 — visuals only slice.
- **Hot rank detail header layout**: Flutter places share above title with gradient; RN keeps compact single-row header (wheat + share assets wired).
- **Age filter caret**: Flutter Material arrow; RN uses text `▾`/`▴` (no `icon_downward` in Flutter source).
- **Expert / editor grid**: Flutter 2-column grid; RN horizontal scroll / wrap — cover overlays and avatars match assets.
