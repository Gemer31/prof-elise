import { AdminEditor } from '@/components/admin/AdminEditor';
import { ProfileBase } from '@/components/view/ProfileBase';
import { RouterPath } from '@/app/enums';

export default function EditorPage() {
  return <>
    <ProfileBase activeRoute={RouterPath.EDITOR}>
      <AdminEditor/>
    </ProfileBase>
  </>
}