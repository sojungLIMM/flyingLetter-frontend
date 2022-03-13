import { BrowserRouter, Route, Routes } from "react-router-dom";

import { render, screen, waitFor } from "../../utils/testUtils";
import DeliveredLetters from "./DeliveredLetters";
import { getLetters } from "../../api/axios";

jest.mock("../../api/axios", () => {
  const originalModule = jest.requireActual("../../api/axios");

  return {
    __esModule: true,
    ...originalModule,
    getLetters: jest.fn(),
  };
});

describe("DelieveredLetters Component", () => {
  const DelieveredComponent = (
    <BrowserRouter>
      <Routes>
        <Route path="/letters/delivered" element={<DeliveredLetters />} />
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
    window.history.pushState({}, "", "/letters/delivered");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("do not have delievered Letters", async () => {
    getLetters.mockImplementation(() =>
      Promise.resolve({
        data: {
          data: {
            letters: [],
          },
        },
      })
    );

    render(DelieveredComponent);

    await waitFor(() => {
      expect(
        screen.getByText("아직 도착한 편지가 없습니다.")
      ).toBeInTheDocument();
      expect(screen.queryAllByText("친구")).toHaveLength(0);
    });
  });

  test("do have delievered Letters", async () => {
    getLetters.mockImplementation(() =>
      Promise.resolve({
        data: {
          data: {
            letters: [
              {
                _id: "123",
                letterId: "234",
                content: "안녕",
                letterWallPaper: "",
                arrivedAt: "2022-03-12T13:13:45.000Z",
                from: {
                  nickname: "소정",
                  language: "한국어",
                  _id: "222",
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

    render(DelieveredComponent);

    await waitFor(() => {
      expect(screen.queryByText("아직 도착한 편지가 없습니다.")).toBeNull();
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

    render(DelieveredComponent);

    await waitFor(() => {
      expect(screen.getByText("오류 발생")).toBeInTheDocument();
    });
  });
});
