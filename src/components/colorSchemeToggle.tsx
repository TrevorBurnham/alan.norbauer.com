"use client";

import React from "react";
import { css } from "@styled-system/css";
import useIsomorphicLayoutEffect from "@/components/useIsomorphicLayoutEffect";
import { DarkModeSwitch } from "react-toggle-dark-mode";

type ColorScheme = "light" | "dark";

/**
 * @returns the color scheme preference, factoring in local storage and the
 * system mode.
 */
function getColorSchemePreference(): ColorScheme {
  const userPreference = localStorage.getItem("color-scheme");
  if (
    userPreference === "light" ||
    (userPreference == null &&
      window.matchMedia("(prefers-color-scheme: light)").matches)
  ) {
    return "light";
  } else {
    return "dark";
  }
}

function setColorSchemeInDOM(colorScheme: ColorScheme): void {
  if (colorScheme === "light") {
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");
  } else {
    document.documentElement.classList.remove("light");
    document.documentElement.classList.add("dark");
  }
}

const toggleStyles = css({
  position: "fixed",
  right: "5px",
  bottom: "5px",

  transition: "opacity var(--durations-color-scheme)",
  opacity: 0.5,
  _hover: {
    opacity: 1,
  },

  hideBelow: "md",
});

export default function ColorSchemeToggle() {
  // This is the source of truth
  const [currentColor, setCurrentColor] = React.useState<
    ColorScheme | undefined
  >();

  const changeColorScheme = React.useCallback(
    (colorScheme: ColorScheme, isUserInitiated: boolean) => {
      // Write to local state (source of truth)
      setCurrentColor(colorScheme);
      // Write to DOM (and possibly localStorage)
      setColorSchemeInDOM(colorScheme);
      if (isUserInitiated) {
        localStorage.setItem("color-scheme", colorScheme);
      }
    },
    []
  );

  const onToggleSwitchClicked = React.useCallback(() => {
    const newColorScheme = currentColor === "light" ? "dark" : "light";
    changeColorScheme(newColorScheme, true);
  }, [changeColorScheme, currentColor]);

  useIsomorphicLayoutEffect(() => {
    console.info(`currentColor = ${currentColor}`);
  }, [currentColor]);

  useIsomorphicLayoutEffect(() => {
    changeColorScheme(getColorSchemePreference(), false);
  }, [changeColorScheme]);

  useIsomorphicLayoutEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");

    function reactToMediaQuery() {
      const preferredColorScheme = getColorSchemePreference();
      // Don't react if the user preference still reflects the current color
      // (this can happen if, for example, `prefers-color-scheme` switched to
      // dark mode at sunset but the user already manually selected light mode.
      if (currentColor !== preferredColorScheme) {
        changeColorScheme(preferredColorScheme, false);
      }
    }

    mq.addEventListener("change", reactToMediaQuery);

    return () => mq.removeEventListener("change", reactToMediaQuery);
  }, [changeColorScheme, currentColor]);

  if (currentColor == null) {
    return null;
  }

  return (
    <DarkModeSwitch
      className={toggleStyles}
      checked={currentColor === "dark"}
      onChange={onToggleSwitchClicked}
      size={25}
      suppressHydrationWarning={true}
    />
  );
}