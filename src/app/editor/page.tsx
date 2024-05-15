import { AdminEditor } from '@/components/AdminEditor';
import { Notification } from '@/components/Notification';
import { Header } from '@/components/Header';
import { ContentContainer } from '@/components/ContentContainer';

export default function EditorPage() {
  return <>
    <Notification/>
    <div id="page" className="relative flex flex-col items-center h-full z-10 mb-4">
      <Header/>
      <ContentContainer id="content" styleClass="w-full flex justify-start px-2">
        <AdminEditor/>
      </ContentContainer>
    </div>
  </>;
}