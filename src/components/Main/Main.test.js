import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";

import { render, screen, waitFor } from "../../utils/testUtils";
import Main from "./Main";
import { getLetters } from "../../api/axios";

jest.mock("leaflet");
jest.mock("../../hooks/useGeoLocation", () => ({
  __esModule: true,
  default: () => ({
    loaded: false,
    lat: 37,
    lng: 127,
  }),
}));

jest.mock("../../api/axios", () => {
  const originalModule = jest.requireActual("../../api/axios");

  return {
    __esModule: true,
    ...originalModule,
    getLetters: jest.fn(),
  };
});

jest.mock("react-redux", () => {
  const originalModule = jest.requireActual("react-redux");

  return {
    __esModule: true,
    ...originalModule,
    useSelector: jest.fn(),
  };
});

describe("Main Component", () => {
  const mainComponent = (
    <BrowserRouter>
      <Routes>
        <Route path="/main" element={<Main />} />
      </Routes>
    </BrowserRouter>
  );

  beforeEach(() => {
    useSelector.mockImplementation((selector) =>
      selector({
        user: {
          isLoggedIn: true,
          status: "",
          data: {
            _id: "123",
            country: "South Korea",
            nickname: "소정",
            language: "한국어",
            lat: 37.5565167,
            lng: 126.8591807,
            profileImage: "",
            email: "thwjd9897@gmail.com",
          },
        },
      })
    );
    window.history.pushState({}, "", "/main");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should render user information", async () => {
    getLetters.mockImplementation(() =>
      Promise.resolve({
        data: {
          data: {
            counts: {},
          },
        },
      })
    );
    render(mainComponent);

    await waitFor(() => {
      expect(screen.getByText("thwjd9897@gmail.com")).toBeInTheDocument();
      expect(screen.getByText("소정")).toBeInTheDocument();
      expect(screen.getByText("South Korea")).toBeInTheDocument();
      expect(screen.getByText("한국어")).toBeInTheDocument();
    });
  });

  test("should render number if have letters", async () => {
    getLetters.mockImplementation(() =>
      Promise.resolve({
        data: {
          data: {
            counts: { deliveredLetterCount: 10, inTransitLetterCount: 5 },
          },
        },
      })
    );

    render(mainComponent);

    await waitFor(() => {
      expect(screen.getByText("10개")).toBeInTheDocument();
      expect(screen.getByText("5개")).toBeInTheDocument();
    });
  });

  test("do not render leaflet map if rejected", async () => {
    getLetters.mockImplementation(() =>
      Promise.reject({
        response: {
          data: { message: "" },
        },
      })
    );
    render(mainComponent);

    await waitFor(() => {
      expect(
        screen.getByText("위치 가져오는 중 입니다. 잠시만 기다려 주세요.")
      ).toBeInTheDocument();
    });
  });
});
