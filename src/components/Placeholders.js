import React from "react";
import { Card, PageHeader, EmptyState } from "../ui/components";

export function HomeworkPage({ inClass }) {
  return (
    <>
      <PageHeader eyebrow="Homework" title="Homework" sub="Work your tutor sets you, with marks and feedback on the same page." />
      <Card padding={0}>
        {inClass
          ? <EmptyState icon="checkSquare" title="Nothing set yet" body="When your tutor sets homework it appears here with a due date. You can stop and come back; answers save as you go." />
          : <EmptyState icon="users" title="Join your class first" body="Enter your tutor's class code from the account menu (top right). Homework and feedback will show up here." />}
      </Card>
    </>
  );
}

export function VideosPage({ count = 1, total = 84 }) {
  return (
    <>
      <PageHeader eyebrow="Videos" title="Video library" sub="Short explanations by HSJ Tuition, linked to the topics you get wrong." />
      <Card padding={0}>
        <EmptyState icon="video" title="Being recorded now" body={`${count} of ${total} AS videos are ready. Videos appear here as they're published, and in your feedback for the topics they cover.`} />
      </Card>
    </>
  );
}
