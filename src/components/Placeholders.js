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

export function VideosPage() {
  return (
    <>
      <PageHeader eyebrow="Learn" title="Video modules" sub="Short HSJ Tuition explanations for every topic, linked to the questions you get wrong." />
      <Card padding={0}>
        <EmptyState icon="video" title="Video modules coming soon" body="Being recorded now. Until then, your lessons and the past-paper practise are the place to learn from: every marked answer shows the mark scheme and where the marks were lost." />
      </Card>
    </>
  );
}
