A functional Date Picker component where the core logic is entirely decoupled from the UI framework, built with Vanilla TypeScript and Vue 3.

## 🚀 Technical Approach

### 1. State Management & Decoupling

The project consume a external package for the logic of the datapicker, this package is `src-datapicker-lib`.
With this implementation we can use this logic in other frameworks, publish this package to npm, etc, be imaginative with the implementation and posibilities :D

I put comments on the library cretion to read the code and understand the logic and how it works.

Gemini flash was used with antigravity to help to coding this project and solve some doubts :D

The styles setted are the basic inherit on the project vue started.

### 2. Temporal API Observations

While the challenge encouraged the use of the **Temporal API**, it is currently a Stage 3 proposal and not natively available in all environments without a polyfill.

- **Implementation Choice**: I used the legacy `Date` object to maintain the "Zero Dependencies" requirement.
- **Observations**: Using `Temporal` would significantly simplify calculations. For instance, `Temporal.PlainDate` handles month overflows automatically and provides an immutable API that prevents accidental state mutations, which is a common source of bugs with the legacy `Date` object.

## 🛠️ How to Run

1. **Fast Install Dependencies and dev**:

    ```bash
    npm run install:lib-and-dev
    ```

    only run dev (if dependencies are installed)

    ```bash
    npm run dev
    ```

    option with compose

    ```bash
    docker compose up
    ```

## 📂 Project Structure

- `src-datapicker-lib/src/picker.ts`: The Headless Logic Engine (Pure TS).
- `src/components/DatePicker.vue`: The Vue 3 Wrapper.
- `src/App.vue`: Main demo application.
- `src/style.css`: Global theme variables.

_Made with ❤️ and a lot of imagination. Happy coding!_ ✨
