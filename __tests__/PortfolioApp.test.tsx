import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { PortfolioApp } from "@/components/PortfolioApp";
import { Header } from "@/components/portfolio/Header";
import { HeroTurntable } from "@/components/portfolio/HeroTurntable.client";
import { ProjectArchive } from "@/components/portfolio/ProjectArchive.client";
import { SkillMatrix } from "@/components/portfolio/SkillMatrix.client";
import { skillAttributes } from "@/lib/portfolio-data";

describe("portfolio shell", () => {
  it("renders the main top-page sections", () => {
    render(<PortfolioApp />);

    expect(screen.getByRole("link", { name: "YUU's room" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: /課題を解決する/ })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Skill Matrix" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Selected Works" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /Full-stack Web Engineer/ })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "コード、経歴、採用導線をまとめています。" })).toBeInTheDocument();
    expect(screen.getByText("NEXT.JS / REACT / TYPESCRIPT")).toBeInTheDocument();
  });

  it("exposes primary navigation by role and name", () => {
    render(<Header />);

    const navigation = screen.getByRole("navigation", { name: "Primary" });
    expect(within(navigation).getByRole("link", { name: "Skills" })).toHaveAttribute("href", "/#matrix");
    expect(within(navigation).getByRole("link", { name: "Projects" })).toHaveAttribute("href", "/#projects");
  });
});

describe("hero turntable", () => {
  it("toggles its pressed state", async () => {
    const user = userEvent.setup();
    render(<HeroTurntable />);

    const button = screen.getByRole("button", { name: "スキルレーダーを表示" });
    expect(button).toHaveAttribute("aria-pressed", "false");

    await user.click(button);

    expect(button).toHaveAttribute("aria-pressed", "true");
  });
});

describe("skill matrix", () => {
  it("renders all skill chips and the initial field note", () => {
    render(<SkillMatrix />);

    for (const attribute of skillAttributes) {
      expect(screen.getByRole("button", { name: attribute.label })).toBeInTheDocument();
    }

    expect(screen.getByText("フロントエンド")).toBeInTheDocument();
    expect(screen.getByText("2.0")).toBeInTheDocument();
    expect(screen.getByLabelText("フロントエンドを表示")).toBeInTheDocument();
  });

  it("switches field notes from a chip click", async () => {
    const user = userEvent.setup();
    render(<SkillMatrix />);

    await user.click(screen.getByRole("button", { name: "QA" }));

    expect(screen.getByText("品質保証・テスト")).toBeInTheDocument();
    expect(screen.getByText("DenimDB Migrator")).toBeInTheDocument();
    expect(screen.getByText("Care Label Auth")).toBeInTheDocument();
  });

  it("switches field notes from a keyboard interaction on the radar", async () => {
    const user = userEvent.setup();
    render(<SkillMatrix />);

    const radarButton = screen.getByLabelText("セキュリティを表示");
    radarButton.focus();
    await user.keyboard("{Enter}");

    expect(screen.getByText("セキュリティ")).toBeInTheDocument();
    expect(screen.getByText("Telemetry 9")).toBeInTheDocument();
    expect(screen.getByText("Care Label Auth")).toBeInTheDocument();
  });
});

describe("project archive", () => {
  it("filters projects by skill attribute and resets to all", async () => {
    const user = userEvent.setup();
    render(<ProjectArchive />);

    expect(screen.getByText("Analog E-Commerce")).toBeInTheDocument();
    expect(screen.getByText("DenimDB Migrator")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "SEC" }));

    expect(screen.queryByText("Analog E-Commerce")).not.toBeInTheDocument();
    expect(screen.getByText("Telemetry 9")).toBeInTheDocument();
    expect(screen.getByText("Care Label Auth")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "ALL" }));

    expect(screen.getByText("Analog E-Commerce")).toBeInTheDocument();
    expect(screen.getByText("DenimDB Migrator")).toBeInTheDocument();
  });
});
