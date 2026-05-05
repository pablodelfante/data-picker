A functional Date Picker component where the core logic is entirely decoupled from the UI framework, built with Vanilla TypeScript and Vue 3.

## 🚀 Technical Approach

### 1. State Management & Decoupling

The project follows a **Logic Engine** pattern. All calendar calculations (grid generation, month/year navigation, selection state) reside in the `Picker` class (`src/core/picker.ts`).

- **Zero Dependencies**: The engine uses native Web APIs only.
- **Bridge to Vue**: The Vue component (`DatePicker.vue`) initializes the logic engine and uses local reactive references to synchronize the engine's state with the UI. When the user interacts with the UI, the engine is updated, and the grid is re-generated and pushed back into Vue's reactivity system.

### 2. Temporal API Observations

While the challenge encouraged the use of the **Temporal API**, it is currently a Stage 3 proposal and not natively available in all environments without a polyfill.

- **Implementation Choice**: I used the legacy `Date` object to maintain the "Zero Dependencies" requirement.
- **Observations**: Using `Temporal` would significantly simplify calculations. For instance, `Temporal.PlainDate` handles month overflows automatically and provides an immutable API that prevents accidental state mutations, which is a common source of bugs with the legacy `Date` object.

### 3. Styling & Aesthetics

- **Design System**: Built using CSS Custom Properties (Variables) defined in `src/style.css`.
- **UX/UI**: Features a premium look with glassmorphism, smooth transitions, and responsive design.
- **A11y**: Supports `Esc` to close and basic keyboard navigation hints.

## 🛠️ How to Run

1. **Install Dependencies**:

    ```bash
    npm install
    ```

2. **Start Development Server**:

    ```bash
    npm run dev
    ```

3. **Build for Production**:
    ```bash
    npm run build
    ```

## 📂 Project Structure

- `src/core/picker.ts`: The Headless Logic Engine (Pure TS).
- `src/components/DatePicker.vue`: The Vue 3 Wrapper.
- `src/App.vue`: Main demo application.
- `src/style.css`: Global theme variables.
