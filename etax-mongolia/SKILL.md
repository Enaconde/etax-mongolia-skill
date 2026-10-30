---
name: etax-mongolia
description: File Mongolian tax reports on eTax (etax.mta.mn, Цахим татварын систем) by driving the user's own logged-in Chrome. Covers zero reports (тэг тайлан, "үйл ажиллагаа явуулаагүй"), overdue reports (Хоцорсон тайлан), requests to reopen them (Хүсэлт илгээх / хугацаа сунгуулах хүсэлт), checking whether a request is approved, and confirming a report really went through. Use this whenever the user mentions eTax, etax.mta.mn, tailan/тайлан, TT-02, TT-11, TT-06 or another TT- form, their tatvar or tatvariin baitsaagch, a late or missed tax report, or a company that "did nothing" and needs its reports filed, even if they never say "eTax".
---

# Mongolian eTax filing (etax.mta.mn)

This skill drives eTax in the user's own Chrome, where they are already logged in. You fill the forms and verify them. The user signs. eTax filings are legal declarations to the tax authority, so a few lines are firm:

- **Never type the user's signing password or pick their key file.** The digital-signature step (Файл сонгох + Нууц үг) is always theirs. Fill everything else, then hand off.
- **Confirm before anything that submits without a signature.** Some forms (e.g. a personal "Иргэн" account) show "Нууц үгээр баталгаажсан", which means clicking Илгээх submits directly. Show the user what will be sent and get a clear yes first.
- **Only report what's true.** A zero report says the entity had no activity. Before filing one, confirm that with the user ("no income, no sales, no wages this period?"). Don't infer it from silence. The same goes for the reason in a late-request note: use the user's real reason, in their words where possible.
- **Don't guess numbers.** If the user had activity, ask for the figures. Don't fill amounts you don't have.

## Getting oriented (do this first, every time)

1. Get the Chrome tab context and open `https://etax.mta.mn/app/report-menu/report-late` in a tab of your own group. The user's session cookie carries over.
2. **Check which taxpayer is active.** The header shows `Регистр : …`. One login can manage several taxpayers (a person and their companies), and eTax often opens on the personal account. If the user means their company, switch through the header dropdown (▼ next to the name) and pick the company's register number. Re-check the header after switching.
3. Read three places:
   - **Хоцорсон тайлан** (`/app/report-menu/report-late`): overdue reports and their per-row action.
   - **Тайлан тушаах** (`/app/report-menu/report-submit`): reports currently open for filing on time.
   - **Хүсэлтийн түүх** (`/app/request-menu/request-history`): every request with its reference number and status. Click a row to see its step-by-step history and the office's comments (Тайлбар).

eTax is a single-page app. Navigating straight to some routes returns a 404 page. If that happens, load any working page, then click the sidebar link (find the `<a>` by its `href` and `.click()` it via JavaScript). Screenshots often time out because the tab runs in the background. Read the page with `get_page_text`, `find` and `javascript_tool` instead.

## What the statuses mean

These names are easy to misread, so check here before telling the user anything.

| Where | Status / button | Meaning |
|---|---|---|
| Late list row | **Хүсэлт илгээх** button | No live request. A new one must be sent before this report can be filed. |
| Late list row | **Хүсэлт илгээсэн** | A request is pending. Wait. |
| Late list row | **Хуулийн хугацаа сунгасан** + **Тайлан тушаах** button | **Approved.** The report is open to file now. |
| Request history | ИЛГЭЭСЭН | Sent, not yet handled |
| Request history | Нэгжийн удирдлагад шилжүүлсэн | Forwarded to unit management. Usually the step right before approval. |
| Request history | **ХУУЛИЙН ХУГАЦАА СУНГАСАН** | **Approved**, despite literally reading as "legal deadline extended". It is not a delay. |
| Request history | БУЦААСАН | Returned (rejected). Open the row and read the comment. |
| Request history | ОЛГОСОН | Granted (e.g. a digital-signature request) |

**The approval window is short (a few days).** If an approved report isn't filed in time, its row silently goes back to "Хүсэлт илгээх" while the old request still shows as approved in history. The office will then say "you made no request". File the same day it's approved, and tell the user so.

## Workflow A: request to reopen an overdue report

Use this when a late-list row shows **Хүсэлт илгээх**.

1. Click that row's **Хүсэлт илгээх**. A "Хүсэлт гаргах" modal opens with office, register, name, year, report and period already filled. Verify they match the row.
2. **Шалтгаан** (reason): a select of legal grounds 4.1.8.а–з. Pick the one that's true. For most cases (didn't know, no digital signature yet, newly registered company) it's `9 - 4.1.8.з.бусад` (other).
3. **Тайлбар** (note): short and factual, in Mongolian, from the user's real situation. See `references/notes.md` for templates.
4. **Баталгаажуулалт**: if radios are shown, pick "Татварын цахим гарын үсэг" and hand off to the user to choose the key file, type the password and click Илгээх. If it says "Нууц үгээр баталгаажсан", confirm with the user first, then click Илгээх.
5. **Verify.** Reload Хүсэлтийн түүх, find the new reference number dated today, open it and check it names the right report and period. If nothing new appears, the send failed. Re-fill and watch for an error popup when the user clicks Илгээх. Give the user the reference number.

Send one report at a time. The modal handles a single report, and verifying each one before the next avoids losing track.

**If a request comes back БУЦААСАН**, read its comment. A common one is "Хариуцсан байцаагчтайгаа холбогдоно уу / ирж уулзана уу. 207 тоот" (contact or visit your assigned inspector, room 207). The user has to go in person. Often they get a short training on late filing and a reference number. Then resend the requests with a note mentioning the meeting, the training and that number.

**Order matters for the same report type.** eTax won't accept a later period while an earlier one of the same form is unfiled (e.g. Q3 TT-11 fails with error **1003**, "previous period report not found", until Q2 TT-11 is filed). Request and file the earliest period first.

## Workflow B: fill and save a zero report

Use this when a row shows **Тайлан тушаах** (from the late list) or appears under Тайлан тушаах.

1. Click **Тайлан тушаах**. The form opens in a **new tab** (`/app/report-menu/report-form-new/...`). Switch to that tab ID.
2. Confirm the header in the form: ТТД, ТТ нэр and Тайлант хугацаа must match what you meant to file.
3. Tick both checkboxes:
   - "Тухайн тайлант хугацаанд **үйл ажиллагаа явуулаагүй** бол энд тэмдэглэнэ үү" (no activity this period)
   - "Тайлангаа **төгрөг мөнгөөр** тайлагнахыг зөвшөөрч шивсэн болно" (amounts are in tögrög)

   Tick them with a JavaScript `.click()` on the `<input type=checkbox>`, found by its label text. A plain CDP click on the first box often doesn't stick. Read `.checked` back afterwards. An old saved draft may already have one ticked, so only click boxes that aren't checked.
4. Check that no amount field has a non-zero value.
5. Click **Хадгалах** (save) with a real click and confirm through the network that `POST /backapi/beta/return/saveFormData` returned 200. There's no visible toast, so the network is the only proof. Saving is required before Илгээх works.
6. Hand off: the user scrolls down, clicks **Илгээх** and signs with their key file and password.
7. **Verify.** The report should vanish from Хоцорсон тайлан. Then open Тайлангийн түүх, choose the year, click Хайх and expand the form type. The period should be listed. Close the form tab you opened.

If the entity did have activity, don't tick "no activity". Ask the user for the figures, or tell them this one needs their accountant.

## Handing off to the user

Each time the user has to act, tell them exactly:
- which tab (the eTax tab in Claude's tab group; a form tab is titled with the form and period)
- what's already filled, as a short list, quoting the Mongolian note
- the steps: **Файл сонгох** → their key file → **Нууц үг** → **Илгээх**
- that you'll verify once they say it's sent

Then stop and wait. When they reply, verify in the history before saying it's done. "I clicked send" isn't proof.

## Common forms

| Code | Form | Who |
|---|---|---|
| TT-02 | Аж ахуйн нэгжийн орлогын албан татвар (corporate income tax), quarterly and annual | companies |
| TT-11 | Цалин, хөдөлмөрийн хөлс… суутгасан татвар (withheld payroll tax), quarterly | companies (zero if no wages) |
| TT-06 | Хувь хүний орлогын албан татвар (individual income tax), annual | individuals with non-wage income |

## Reference

- `references/notes.md`: Тайлбар note templates for late requests (Mongolian, with English).
- `scripts/etax-helpers.js`: copy-paste JavaScript snippets for `javascript_tool` (read tables, open a request row's history, tick checkboxes by label).
