import { LOCALE, TRANSLATES } from '@/app/translates';
import { Button } from '@/components/ui/Button';
import { ButtonTypes, ColorOptions, FirestoreCollections } from '@/app/enums';
import Image from 'next/image';
import { InputFormField } from '@/components/ui/form-fields/InputFormField';
import { ReadonlyFormField } from '@/components/ui/ReadonlyFormField';
import { useAppDispatch } from '@/store/store';
import { useEffect, useState } from 'react';
import { IUser } from '@/app/models';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { YupUtil } from '@/utils/yup.util';
import { setNotificationMessage } from '@/store/dataSlice';
import { updateEmail } from '@firebase/auth';
import { auth, db } from '@/app/lib/firebase-config';
import { setDoc } from '@firebase/firestore';

interface IChangeEmailFormProps {
  userServer: IUser<string, string[]>;
}

export function ChangeEmailForm({userServer}: IChangeEmailFormProps) {
  const dispatch = useAppDispatch();
  const [user, setUser] = useState<IUser<string, string[]>>();
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: {errors, isValid}
  } = useForm({
    mode: 'onSubmit',
    resolver: yupResolver(YupUtil.ChangeEmailSchema)
  });

  useEffect(() => {
    setUser(userServer);
    setValue('email', userServer.email);
  }, [userServer]);

  const submitForm = async ({email}: { email?: string; }) => {
    await updateEmail(auth.currentUser, email);
    // await setDoc(db, FirestoreCollections.USERS, )


    dispatch(setNotificationMessage(TRANSLATES[LOCALE].infoSaved));
  };

  return <form onSubmit={handleSubmit(submitForm)}>
    <fieldset className="w-full relative border-2 rounded-md p-4 flex flex-col gap-y-2" disabled={isLoading}>
      <legend className="ml-4">{TRANSLATES[LOCALE].userData}</legend>
      <div className="absolute right-4 top-[-28px]">
        {
          editMode
            ? <Button type={ButtonTypes.SUBMIT} styleClass="px-2 py-1" color={ColorOptions.PINK}>
              <div className="flex gap-x-2">
                <>
                  <Image width={20} height={20} src="/icons/save.svg" alt="Save main info"/>
                  <span>{TRANSLATES[LOCALE].save}</span>
                </>
              </div>
            </Button>
            : <Button type={ButtonTypes.BUTTON} styleClass="px-2 py-1" color={ColorOptions.PINK}
                      callback={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setEditMode((prevState) => (!prevState))
                      }}>
              <div className="flex gap-x-2">
                <>
                  <Image width={20} height={20} src="/icons/edit.svg" alt="Edit main info"/>
                  <span>{TRANSLATES[LOCALE].edit}</span>
                </>
              </div>
            </Button>
        }
      </div>
      {
        editMode
          ? <>
            <InputFormField
              required={true}
              placeholder="E-mail"
              label="E-mail"
              name="email"
              type="text"
              error={errors.email?.message}
              register={register}
            />
          </>
          : <>
            <ReadonlyFormField label={TRANSLATES[LOCALE].fio} value={user?.email || userServer.email}/>
          </>
      }
    </fieldset>
  </form>
}