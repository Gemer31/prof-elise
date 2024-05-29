import { AdminEditor } from '@/components/admin/AdminEditor';
import { ContentContainer } from '@/components/ui/ContentContainer';

export default function EditorPage() {
  return <>
    <ContentContainer id="content" styleClass="w-full flex justify-start px-2 mb-4">
      <AdminEditor/>
    </ContentContainer>
  </>;
}