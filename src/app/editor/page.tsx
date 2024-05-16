import { AdminEditor } from '@/components/AdminEditor';
import { ContentContainer } from '@/components/ContentContainer';

export default function EditorPage() {
  return <>
    <ContentContainer id="content" styleClass="w-full flex justify-start px-2">
      <AdminEditor/>
    </ContentContainer>
  </>;
}