"use client";

import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  Droppable,
  DroppableProvided,
} from "@hello-pangea/dnd";
import { Box, Flex, Group, Paper, Text } from "@mantine/core";
import { useListState, useMediaQuery } from "@mantine/hooks";
import { IconMenu } from "@tabler/icons-react";
import { useEffect } from "react";

type Props = {
  title: string;
  items: { value: string; label: string }[];
  setOrderedList: (value: string[]) => void;
};

export const OrderQuestion = ({ title, items, setOrderedList }: Props) => {
  const [stack, stackHandlers] = useListState(items);
  const [orderedList, orderedListHandlers] = useListState([items[0]]);

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
    stackHandlers.remove(0);
  }, []);

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
          <Droppable droppableId="stack" direction="vertical">
            {(dropProvided: DroppableProvided) => (
              <div {...dropProvided.droppableProps} ref={dropProvided.innerRef}>
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
        )}

        <Box style={{ border: "1px solid gray", minHeight: 80, padding: 10 }}>
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
      px={smallScreen ? 5 : "md"}
      py={smallScreen ? "xs" : "md"}
      withBorder
      shadow="sm"
    >
      <Flex justify="space-between" align="center" px="lg">
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
