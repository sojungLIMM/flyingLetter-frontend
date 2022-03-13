import {
  fireEvent,
  render,
  screen,
  cleanup,
  waitFor,
} from "@testing-library/react";

import Signup from "./Signup";
import { checkSignupInfo } from "../../api/axios";

jest.mock("react-router-dom");
jest.mock("../../api/axios", () => {
  const originalModule = jest.requireActual("../../api/axios");

  return {
    __esModule: true,
    ...originalModule,
    checkSignupInfo: jest.fn(),
  };
});

describe("email input in SignUp Component", () => {
  afterEach(() => {
    cleanup();
  });

  test("render need email message if email is empty", () => {
    render(<Signup />);

    const button = screen.getByRole("button", { name: "이메일 중복 확인" });

    fireEvent.click(button);
    expect(screen.getByText("이메일을 입력하세요.")).toBeInTheDocument();
  });

  test("render success message if email form is correct", async () => {
    checkSignupInfo.mockImplementation(() => Promise.resolve("ok"));

    render(<Signup />);
    const input = screen.getByPlaceholderText("이메일");
    const button = screen.getByRole("button", { name: "이메일 중복 확인" });

    fireEvent.change(input, { target: { value: "thwjd9897@gmail.com" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("사용 가능한 이메일입니다.")).toBeInTheDocument();
    });
  });

  test("render fail message if email is not unique", async () => {
    checkSignupInfo.mockImplementation(() =>
      Promise.reject({
        response: {
          data: { message: "중복되는 이메일입니다. 다시 입력 해주세요." },
        },
      })
    );

    render(<Signup />);

    const input = screen.getByPlaceholderText("이메일");
    const button = screen.getByRole("button", { name: "이메일 중복 확인" });

    fireEvent.change(input, { target: { value: "thwjd9897@gmail.com" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(
        screen.getByText("중복되는 이메일입니다. 다시 입력 해주세요.")
      ).toBeInTheDocument();
    });
  });
});

describe("nickname input in SignUp Component", () => {
  test("render need nickname message if email is empty", () => {
    render(<Signup />);

    const button = screen.getByRole("button", { name: "닉네임 중복 확인" });

    fireEvent.click(button);
    expect(screen.getByText("닉네임을 입력하세요.")).toBeInTheDocument();
  });

  test("render success message if nickname is unique", async () => {
    checkSignupInfo.mockImplementation(() => Promise.resolve("ok"));
    render(<Signup />);

    const input = screen.getByPlaceholderText("닉네임");
    const button = screen.getByRole("button", { name: "닉네임 중복 확인" });

    fireEvent.change(input, { target: { value: "소정" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("사용 가능한 닉네임입니다.")).toBeInTheDocument();
    });
  });

  test("render fail message if nickname is not unique", async () => {
    checkSignupInfo.mockImplementation(() =>
      Promise.reject({
        response: {
          data: { message: "중복되는 닉네임입니다. 다시 입력 해주세요." },
        },
      })
    );

    render(<Signup />);

    const input = screen.getByPlaceholderText("닉네임");
    const button = screen.getByRole("button", { name: "닉네임 중복 확인" });

    fireEvent.change(input, { target: { value: "소정" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(
        screen.getByText("중복되는 닉네임입니다. 다시 입력 해주세요.")
      ).toBeInTheDocument();
    });
  });
});
