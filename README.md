# Quantum Hardware Scrollyteller

An interactive timeline visualizing the evolution of quantum hardware technologies using a scroll-driven dot plot.

## Technologies Used

- **React** (+ TS)
- **Vite**
- **Framer Motion**
- **visx** (d3 alternative)
- **Scrollama** (ScrollMagic alternative)
- **Bun**

## 🛠️ Running Locally

1. **Install Bun** if not already installed:  
   https://bun.sh

2. **Clone and install dependencies**:
   ```bash
   bun install
   ```

3. **Run the development server**:
   ```bash
   bun run dev
   ```

4. Open your browser at:  
   http://localhost:5173

> Make sure `data.json` is present in the `public/` directory and formatted correctly.

## Design & Implementation Notes

- The dot plot updates progressively with scroll using Scrollama and state-driven data slicing.
- A log-log scale (qubits vs. error rate) reveals quantum performance trends.
- Points are color- and shape-coded by technology (e.g., trapped ion vs superconducting).
- The chart shifts subtly left or right to highlight milestones, and fades out after the final step.
