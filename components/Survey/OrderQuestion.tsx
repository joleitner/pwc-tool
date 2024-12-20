"use client";

import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  Droppable,
  DroppableProvided,
} from "@hello-pangea/dnd";
import { Box, Flex, Group, Paper, Stack, Text } from "@mantine/core";
import { useListState, useMediaQuery } from "@mantine/hooks";
import {
  IconArrowDownDashed,
  IconHandGrab,
  IconMenu,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

type Props = {
  title: string;
  items: { value: string; label: string }[];
  setOrderedList: (value: string[]) => void;
};

export const OrderQuestion = ({ title, items, setOrderedList }: Props) => {
  const t = useTranslations("Questionnaire");
  const [stack, stackHandlers] = useListState(items);
  const [orderedList, orderedListHandlers] = useListState<{
    value: string;
    label: string;
  }>([]);

  const handleDragEnd = ({ destination, source }: any) => {
    if (!destination || destination.droppableId === "stack") return;
    if (source.droppableId === "stack") {
      const newItem = stack[source.index];
      orderedListHandlers.insert(destination.index, newItem);
      stackHandlers.remove(source.index);
    }
    if (source.droppableId === "order-list") {
      orderedListHandlers.reorder({
        from: source.index,
        to: destination.index,
      });
    }
  };

  useEffect(() => {
    setOrderedList(orderedList.map((item) => item.value));
  }, [orderedList]);

  return (
    <Box style={{ width: "100%" }}>
      <Text fw="bold" mb="sm">
        {title}
      </Text>
      <DragDropContext onDragEnd={handleDragEnd}>
        {stack.length > 0 && (
          <>
            <Droppable droppableId="stack" direction="vertical">
              {(dropProvided: DroppableProvided) => (
                <div
                  {...dropProvided.droppableProps}
                  ref={dropProvided.innerRef}
                >
                  <Draggable
                    key={stack[0].value}
                    index={0}
                    draggableId={stack[0].value}
                  >
                    {(dragProvided: DraggableProvided) => (
                      <Box
                        p={10}
                        my={5}
                        {...dragProvided.draggableProps}
                        {...dragProvided.dragHandleProps}
                        ref={dragProvided.innerRef}
                      >
                        <OrderItem label={stack[0].label} />
                      </Box>
                    )}
                  </Draggable>
                  {dropProvided.placeholder}
                </div>
              )}
            </Droppable>
            <Flex justify="center">
              <IconArrowDownDashed />
            </Flex>
          </>
        )}

        <Box
          style={{
            border: "1px solid gray",
            minHeight: 100,
            padding: 10,
            position: "relative",
          }}
        >
          {orderedList.length === 0 && (
            <Stack
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "100%",
                transform: "translate(-50%, -50%)",
              }}
              align="center"
              gap={5}
            >
              <IconHandGrab color="gray" />
              <Text size="sm" c="gray" ta="center">
                {t("dragHint")}
              </Text>
            </Stack>
          )}
          <Droppable droppableId="order-list" direction="vertical">
            {(dropProvided: DroppableProvided) => (
              <div {...dropProvided.droppableProps} ref={dropProvided.innerRef}>
                {orderedList.map((item, index) => (
                  <Draggable
                    key={item.value}
                    index={index}
                    draggableId={item.value.toString()}
                  >
                    {(dragProvided: DraggableProvided) => (
                      <Box
                        my={5}
                        {...dragProvided.draggableProps}
                        {...dragProvided.dragHandleProps}
                        ref={dragProvided.innerRef}
                      >
                        <OrderItem label={item.label} index={index + 1} />
                      </Box>
                    )}
                  </Draggable>
                ))}
                {dropProvided.placeholder}
              </div>
            )}
          </Droppable>
        </Box>
      </DragDropContext>
    </Box>
  );
};

const OrderItem = ({ label, index }: { label: string; index?: number }) => {
  const smallScreen = useMediaQuery("(max-width: 768px)", true);

  return (
    <Paper
      px={smallScreen ? "xs" : "lg"}
      py={smallScreen ? "xs" : "md"}
      withBorder
      shadow="sm"
      style={{
        borderColor: index ? undefined : "red",
        backgroundColor: index ? undefined : "rgba(255, 0, 0, 0.1)",
      }}
    >
      <Flex justify="space-between" align="center">
        <Group gap="md">
          {index && (
            <Text fw="bold" size="sm">
              {index}.{" "}
            </Text>
          )}
          <Text size="sm">{label}</Text>
        </Group>
        <IconMenu color="gray" size={20} />
      </Flex>
    </Paper>
  );
};
