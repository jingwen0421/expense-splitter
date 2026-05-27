# FairShare - Expense Splitter App

FairShare is a web-based expense splitter app built for the Shortcut Asia Internship Challenge 2026. It helps users manage shared expenses for trips, meals, housemates, or group activities.

Users can create multiple groups, add members, record expenses, split costs equally or unequally, and view balance and settlement suggestions.

## Live Demo

https://expense-splitter-three-beta.vercel.app/

## GitHub Repository

https://github.com/jingwen0421/expense-splitter

## Features

- Create and manage multiple expense groups
- Add and remove members
- Prevent member removal if the member is already used in an existing expense
- Add, edit, and delete expenses
- Equal split calculation
- Unequal split with custom share validation
- Running total for unequal split
- Equal share per person display
- Balance summary for each member
- Settlement suggestion showing who should pay whom
- Expense history with date and time
- Data persistence using browser localStorage
- Responsive and user-friendly interface
- Equal split calculation
- Unequal split by amount
- Unequal split by percentage
- Running total validation for unequal splits
- Settlement payment status tracking
- Outstanding balance after completed payments
- Copy settlement summary with outstanding and completed payments
- Search expense history

## Tech Stack

- Frontend: React, JavaScript
- Styling: Tailwind CSS
- Storage: Browser localStorage
- Build Tool: Vite
- Deployment: Vercel
- Version Control: GitHub

## Why I Chose This Stack

I chose React because it allows the app to be separated into reusable components, making the code easier to organize and maintain.

Tailwind CSS was used to build a clean and responsive interface quickly. Since this is a lightweight prototype for the challenge, I used browser localStorage to save data without requiring backend setup.

## How the App Works

1. The user creates a group.
2. The user adds members to the group.
3. The user records an expense by entering the title, amount, payer, split type, and selected members.
4. The app calculates each member’s balance.
5. The app generates settlement suggestions to show who should pay whom.

## Calculation Logic

For equal split, the total expense amount is divided equally among selected members.

For unequal split, the user enters a custom share for each selected member. The app validates that all custom shares add up to the total expense amount.

Balance logic:
- The payer receives credit for the full amount paid.
- Each selected member is deducted their share.
- A positive balance means the member should receive money.
- A negative balance means the member owes money.

## Challenges Faced

One challenge was handling unequal splits correctly. I solved this by adding validation to ensure that custom shares must match the total expense amount before the expense can be saved.

Another challenge was member deletion. I added a guard to prevent users from removing members who are already involved in existing expenses, so the expense history and balance calculation remain consistent.

## Future Improvements

- Add user login
- Add cloud database support using Firebase or Supabase
- Allow users to share groups using invite links
- Add payment status tracking
- Export settlement summary as PDF
- Add search and filter in expense history

## How to Run Locally

```bash
npm install
npm run dev
```
Then open the local development link shown in the terminal.

## AI Usage Disclosure

AI tools were used as a learning, planning, and debugging assistant during development. The final implementation was reviewed, tested, customized, and organized by me.
