# Network School exam flow: official-source check

Date researched: 2026-08-28
Source scope: current first-party Network School pages (`ns.com`) and, where
useful for general context, Balaji Srinivasan's official site. No form was
submitted and no authenticated exam content was accessed.

## Bottom line

Network School's current public material uses **"online practice exam"** and
**"online exam"** for the same first-stage assessment. It does not document a
separate rehearsal exam that could be lost by applying. The visible flow is:

1. read the public exam overview and sample questions;
2. select **Apply and take exam**;
3. create/connect an account, verify GitHub or X, complete the start form; and
4. start the approximately one-hour online exam.

Submitting the start form therefore appears to be how a candidate gains access
to the online practice exam, not an action that makes the candidate ineligible
for it. However, Network School does **not** publicly state an attempt limit,
retake policy, expiry window, or what happens if a person submits the start form
but stops before completing the exam. Those points remain unknown.

The Replit project URL is explicitly marked **optional**. A project/about-you
narrative is required, despite its Replit-specific label. No public official
instruction says a candidate's project must be built or hosted on Replit.

There is also a decisive submission-integrity constraint: the form says not to
use AI, and Network School's terms prohibit generative AI and third-party
drafting, editing, or material review of exam submissions unless the exam
expressly permits it. An AI assistant should therefore explain the requirements
and research the process, but should not write or edit the applicant's answer.

## Findings by question

### 1. Does submitting or starting the main exam affect access to a practice exam?

**Verified:** The official exam overview says the *first step* is an "online
practice exam." The same page then calls it the "online exam," explains its
three sections, and says a passing score may lead to a similar proctored
in-person exam. The call to action is **Apply and take exam**. The terms likewise
describe one combined first stage as "application and online exam," followed by
approval and an in-person exam.

**Inference:** There is no separately documented "main online exam" versus
"practice online exam." In the current public flow, those labels refer to the
same assessment. Starting/submitting the application is therefore not shown as
canceling practice access; it is the access path.

**Unknown:** No official public source located in this review states:

- whether an account gets more than one online attempt;
- whether a started exam can be paused or restarted;
- whether a submitted application expires; or
- whether a previous Network School application changes eligibility.

Source: [Network School Exam](https://ns.com/exam) (accessed 2026-08-28),
[Network School Terms, section 24.6](https://ns.com/terms) (accessed
2026-08-28; page says last updated 2026-08-17).

### 2. Where is the practice exam, and what does access require?

**Public preparation page:** [https://ns.com/exam](https://ns.com/exam) is
available without an account. It describes the exam, shows sample items for all
three sections, and lists study topics/resources.

**Exam start page:** [https://ns.com/exam/start](https://ns.com/exam/start) is
the account/application form that precedes the online practice exam. Its
first-party rendered instructions require:

- a connected Google or Apple account;
- full name and email;
- at least one verified account from GitHub or X; and
- a required project/about-you response of at most 1,000 characters.

The page says the account takes about one minute to create. The exam overview
says the exam itself should take about one hour and gives the score at the end.

**Payment:** No fee or payment step is stated on either official exam page. The
program is described as a merit-scholarship experiment open to anyone. This is
evidence that no payment is advertised for taking the online exam, not a
guarantee about every authenticated state or later travel/residency cost.

**Application:** Yes, operationally. The official button says **Apply and take
exam**, the start page collects application information, and Network School's
terms treat "application and online exam" as the first scholarship stage.

Sources: [Network School Exam](https://ns.com/exam),
[Begin the Network School Exam](https://ns.com/exam/start), and
[Network School Terms](https://ns.com/terms) (all accessed 2026-08-28).

### 3. Is a Replit project URL required?

**Verified: No.** On the current first-party form, its accessible label is
**"Replit application URL. (Optional)"** and the field has no required marker.
The form can enable its submit button without a Replit URL; the required inputs
are account connection, name, valid email, one verified GitHub/X account, and
the narrative.

The visible URL validation accepts Replit project/deployment domains when a
value is supplied; it does not document an alternate-project URL format. The
safe reading for a non-Replit project is to leave this optional field blank,
rather than put a non-Replit URL into a field labeled for Replit.

**Important inconsistency:** The next required label still says **"Tell us about
your Replit project & yourself."** Thus, Replit hosting is optional, while the
narrative prompt is written as though a Replit project exists. No public FAQ or
exam instruction found in this review resolves that mismatch.

Source: [Begin the Network School Exam](https://ns.com/exam/start), inspected as
rendered first-party form and public page source on 2026-08-28.

### 4. Technical-component expectations for a non-Replit project

**Verified public expectations:** The online exam has three sections:

1. personality (no right answers);
2. language-neutral reasoning; and
3. mathematics and computer-science knowledge.

The published knowledge topics are algebra, calculus, discrete math,
algorithms, complexity theory, linear algebra, probability/statistics, data
structures, systems, operating systems, caches, and memory. Candidates who
advance are told to expect similar material in a proctored pencil-and-paper
exam.

**Not documented:** The current public exam material does not specify a coding
challenge, Replit build task, repository review, supported programming
language, deployment requirement, or minimum technical feature set for the
project mentioned on the start form.

**Inference for a non-Replit project:** The tested technical component is the
math/computer-science knowledge section, not a documented requirement to
rebuild a project on Replit. A working project hosted elsewhere is not ruled out
by any official public instruction found here, but the form offers no dedicated
non-Replit project URL field.

Source: [Network School Exam](https://ns.com/exam) (accessed 2026-08-28).

For background only, Balaji's 2025 curriculum post said programmers would build
projects for "GitHub or Replit portfolios." That supports platform flexibility
as a general Network School idea, but it predates this exam flow and is **not**
an exam rule. Source: [Network School 2025](https://balajis.com/p/network-school-2025)
(published 2025-02-02; accessed 2026-08-28).

### 5. AI and outside-help rule

**Verified:** The current narrative placeholder says, **"Please don't use
AI."** Network School's terms go further: unless an exam expressly permits AI,
the applicant must not use a generative-AI tool for any submission, and a third
party may not draft, edit, or materially review it. The terms also require exam
responses and materials to be the applicant's original work.

**Practical consequence:** Researching eligibility, understanding the form, and
reviewing public study topics are appropriate. Generating, rewriting, polishing,
or materially reviewing the text to paste into question 5 would conflict with
the published rules. The applicant should write that response independently in
their own words.

Sources: [Begin the Network School Exam](https://ns.com/exam/start),
[Network School Terms, section 24.6](https://ns.com/terms) (accessed 2026-08-28).

## Confidence and limitations

Confidence is **high** for the visible flow, field requirements, Replit URL
optionality, public exam topics, and AI restrictions because they are stated by
Network School's current first-party pages and form implementation.

Confidence is **limited** for attempt/retake behavior and authenticated exam
states. No form was submitted, and no official public policy addressing those
questions was found. Network School support is the authoritative place to
resolve them: [https://ns.com/support](https://ns.com/support).

## Official sources checked

| Source | URL | Checked | Use |
| --- | --- | --- | --- |
| Network School Exam | https://ns.com/exam | 2026-08-28 | Flow, sections, study topics, timing, samples |
| Begin the Network School Exam | https://ns.com/exam/start | 2026-08-28 | Account/application and field requirements |
| Network School home page | https://ns.com/ | 2026-08-28 | Confirms online exam then in-person exam sequence |
| Network School Terms | https://ns.com/terms | 2026-08-28 | Scholarship stages, AI/original-work rule, discretion |
| Network School 2025 (Balaji) | https://balajis.com/p/network-school-2025 | 2026-08-28 | Older contextual note about GitHub or Replit portfolios |
