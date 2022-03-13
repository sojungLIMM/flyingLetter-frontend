import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";

import { render, screen, waitFor } from "../../utils/testUtils";
import DeliveredLetterDetail from "./DeliveredLetterDetail";

jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");

  return {
    __esModule: true,
    ...originalModule,
    useLocation: jest.fn(),
  };
});

describe("DelieveredLettersDetail Component", () => {
  const DelieveredDetailComponent = (
    <BrowserRouter>
      <Routes>
        <Route
          path="/letters/delivered/:letterId"
          element={<DeliveredLetterDetail />}
        />
      </Routes>
    </BrowserRouter>
  );

  beforeEach(() => {
    window.history.pushState({}, "", "/letters/delivered/:letterId");
  });

  test("should render letter content", async () => {
    useLocation.mockReturnValue({
      state: { content: "안녕" },
    });

    render(DelieveredDetailComponent);

    await waitFor(() => {
      expect(screen.getByText("안녕")).toBeInTheDocument();
    });
  });
});
