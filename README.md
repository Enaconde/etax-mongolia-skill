# etax-mongolia: a Claude skill for Mongolian eTax

A [Claude skill](https://docs.claude.com/en/docs/agents-and-tools/agent-skills) that lets Claude file reports on **eTax (etax.mta.mn, Цахим татварын систем)** by driving your own logged-in Chrome through Claude in Chrome.

It's built from a real case: a newly registered company with no activity, three overdue reports (TT-02, TT-11 ×2), returned requests, an inspector visit, and finally all reports filed as zero reports.

## What it does

- Reads your overdue reports (Хоцорсон тайлан), open reports and request history
- Explains what the statuses actually mean (e.g. **ХУУЛИЙН ХУГАЦАА СУНГАСАН = approved**)
- Fills the reopen request (Хүсэлт илгээх) with the right reason and a factual Mongolian note
- Fills and saves zero reports (тэг тайлан, "үйл ажиллагаа явуулаагүй") and verifies the save
- Confirms each filing in Тайлангийн түүх after you send it

**You always sign.** The skill never types your digital-signature password or picks your key file, and it asks before anything that submits without a signature.

## Install

Copy the `etax-mongolia/` folder into your skills directory:

- Claude Code: `~/.claude/skills/etax-mongolia/`
- Claude.ai / desktop: zip the `etax-mongolia/` folder and upload it under Settings → Capabilities → Skills

It needs the **Claude in Chrome** extension, with you logged in to etax.mta.mn in that Chrome.

## Use

Just ask, e.g.:

- "My company did nothing this quarter, file the eTax reports"
- "Check whether my late tailan requests are approved"
- "Хоцорсон тайлангаа нөхөж илгээх хүсэлт гаргаад өг"

## Caveats

- eTax's UI changes over time; selectors and routes in `scripts/etax-helpers.js` may need updating.
- Zero reports are only correct if the entity really had no activity. Claude will ask, but you're responsible for what's declared.
- This isn't tax advice. For anything beyond zero reports, talk to an accountant or your tax inspector.
