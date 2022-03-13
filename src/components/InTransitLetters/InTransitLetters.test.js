import { BrowserRouter, Route, Routes } from "react-router-dom";

import { render, screen, waitFor } from "../../utils/testUtils";
import InTransitLetters from "./InTransitLetters";
import { getLetters } from "../../api/axios";

jest.mock("../../api/axios", () => {
  const originalModule = jest.requireActual("../../api/axios");

  return {
    __esModule: true,
    ...originalModule,
    getLetters: jest.fn(),
  };
});

describe("InTransitLetters Component", () => {
  const InTransitComponent = (
    <BrowserRouter>
      <Routes>
        <Route path="/letters/inTransit" element={<InTransitLetters />} />
      </Routes>
    </BrowserRouter>
  );

  beforeEach(() => {
    const mockIntersectionObserver = jest.fn();

    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null,
    });

    window.IntersectionObserver = mockIntersectionObserver;
    window.history.pushState({}, "", "/letters/inTransit");
  });

  test("do not have intransit letters", async () => {
    getLetters.mockImplementation(() =>
      Promise.resolve({
        data: {
          data: {
            letters: [],
          },
        },
      })
    );

    render(InTransitComponent);

    await waitFor(() => {
      expect(
        screen.getByText("배송 중인 편지가 없습니다.")
      ).toBeInTheDocument();
      expect(screen.queryAllByText("친구")).toHaveLength(0);
    });
  });

  test("do have intransit letters", async () => {
    getLetters.mockImplementation(() =>
      Promise.resolve({
        data: {
          data: {
            letters: [
              {
                _id: "123",
                arrivedAt: "2022-03-12T13:13:45.000Z",
                from: {
                  nickname: "소정",
                  language: "한국어",
                  lat: 37.5565167,
                  lng: 126.8591807,
                  country: "South Korea",
                },
              },
            ],
          },
        },
      })
    );

    render(InTransitComponent);

    await waitFor(() => {
      expect(screen.queryByText("배송 중인 편지가 없습니다.")).toBeNull();
      expect(screen.getAllByText("친구", { exact: false })).toHaveLength(1);
    });
  });

  test("render error message", async () => {
    getLetters.mockImplementation(() =>
      Promise.reject({
        response: {
          data: {
            message: "오류 발생",
          },
        },
      })
    );

    render(InTransitComponent);

    await waitFor(() => {
      expect(screen.getByText("오류 발생")).toBeInTheDocument();
    });
  });
});
