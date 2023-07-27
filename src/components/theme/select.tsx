import { css, cx } from "@styled-system/css";
import {
  Select as ArkSelect,
  Portal,
  SelectContent,
  SelectOption,
  SelectPositioner,
  SelectTrigger,
} from "@ark-ui/react";
import { CheckIcon } from "nextra/icons";

type MenuOption = {
  value: string;
  label: React.ReactNode;
};

interface MenuProps {
  selected: MenuOption;
  onChange: (option: MenuOption | null) => void;
  options: MenuOption[];
  title?: string;
  className?: string;
}

export function Select({
  options,
  selected,
  onChange,
  title,
  className,
}: MenuProps) {
  return (
    <ArkSelect onChange={onChange}>
      <SelectTrigger
        className={cx(
          css({
            height: 7,
            borderRadius: "md",
            px: 2,
            textAlign: "left",
            fontSize: "xs",
            fontWeight: "medium",
            cursor: "pointer",
            color: "text",
            bg: "bg",
            transition:
              "color var(--durations-color-scheme), background var(--durations-color-scheme)",

            _expanded: {
              color: "text.card",
              bg: "bg.card",
            },
            _hover: {
              color: "text.card",
              bg: "bg.card",
            },
          }),
          className
        )}
      >
        {selected?.label ?? title}
      </SelectTrigger>
      <Portal>
        <SelectPositioner
          className={css({
            zIndex: 20,
            maxHeight: 64,
            overflow: "auto",
            borderRadius: "md",
            outlineWidth: "1px",
            outlineColor: "rgb(0 0 0 / 0.05)",
            bg: "white",
            py: "1",
            fontSize: "sm",
            shadow: "lg",
            _dark: {
              outlineColor: "rgb(255 255 255 / 0.2)",
              bg: "neutral.800",
            },
          })}
        >
          <SelectContent>
            {options.map((option) => (
              <SelectOption
                key={option.value}
                value={option.value}
                label={option.label as any}
                className={css({
                  color: "colors.text",
                  _hover: {
                    bg: "var(--colors-bg-selection)",
                    color: "var(--colors-text-selection)",
                  },
                  position: "relative",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  py: 1.5,
                  transition: "colors",
                  ps: "3",
                  pe: "9",
                })}
              >
                {option.value === selected.value && (
                  <span
                    className={css({
                      position: "absolute",
                      insetY: 0,
                      display: "flex",
                      alignItems: "center",
                      insetEnd: "3",
                    })}
                  >
                    <CheckIcon />
                  </span>
                )}
                {option.label}
              </SelectOption>
            ))}
          </SelectContent>
        </SelectPositioner>
      </Portal>
    </ArkSelect>
  );
}
