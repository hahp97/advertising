# Project Title

Nextjs and TypeScript Advertising Platform (https://advertising-ten.vercel.app)

## Description

This project is a robust advertising platform built with React and TypeScript. It allows users to create, save, and view
advertisements through an intuitive user interface. The platform supports features such as drag-and-drop for ad
creation, undo and redo functionalities for element manipulation, exporting and importing data, and user interaction via
a dedicated user page.

## Installation

This project relies on npm and yarn for package management. To install all dependencies, execute the following command:

```sh
yarn install
```

## How to Run the Project

You can run the project locally using:

```sh
yarn run dev
```

Alternatively, you can explore the deployed version [here](https://advertising-ten.vercel.app 'Deloy')

## Overview

The project fulfills various requirements, including drag-and-drop functionality for ad creation, saving and viewing ads
from the admin panel, undo and redo options for dragged elements, data export, and import capabilities. Users can
interact with the platform through the dedicated user page.

## Technologies Used

- Nextjs
- TypeScript
- TailwindCss

## Architecture

I focused on building a flexible and scalable architecture by creating reusable components. This not only reduces code
duplication but also establishes a source base that is easy to manage and extend in the future. I opted not to use
Server-side Rendering (SSR) due to the interactive nature of the website, instead, I built a flexible source base for
easy expansion and maintenance.

## Principles

The primary guiding principle in my project is DRY (Don't Repeat Yourself). By utilizing git, I efficiently manage
source code, ensuring consistency and reducing the risk of repetition. This streamlined workflow also supports seamless
deployment on Vercel, creating a cohesive development-to-deployment process.

## Design Pattern / Custom Hook

I employed design patterns such as hooks to create a transparent and understandable approach when using actions like
configuration and modal invocation. Additionally, crafting reusable components reduces source code complexity and
enhances reusability. Middleware was set up for managing the router and handling loading and not-found pages in Next.js,
optimizing user experience and ensuring application consistency.

**These decisions aim to create a maintainable, scalable system, delivering the best user experience.**
