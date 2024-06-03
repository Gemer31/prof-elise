'use client';

import { LOCALE, TRANSLATES } from '@/app/translates';
import { IUser } from '@/app/models';
import { useEffect, useState } from 'react';
import { ReadonlyFormField } from '@/components/ui/ReadonlyFormField';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import { ButtonTypes, ColorOptions } from '@/app/enums';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { InputFormField } from '@/components/ui/form-fields/InputFormField';
import { PhoneFormField } from '@/components/ui/form-fields/PhoneFormField';
import { setNotificationMessage } from '@/store/dataSlice';
import { useAppDispatch } from '@/store/store';
import { YupUtil } from '@/utils/yup.util';

interface IProfileMainInfoProps {
  user: IUser;
}

export function ProfileMainInfo({user}: IProfileMainInfoProps) {
  const dispatch = useAppDispatch();
  const [mainInfoEditMode, setMainInfoEditMode] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: {errors, isValid}
  } = useForm({
    mode: 'onSubmit',
    resolver: yupResolver(YupUtil.ProfileMainInfoSchema)
  });

  useEffect(() => {
    setValue('name', user.name);
    setValue('phone', user.phone);
    setValue('deliveryAddress', user.name);
  }, [user]);

  const submitMainInfoForm = async (formData: {
    name?: string;
    phone?: string;
    deliveryAddress?: string;
    email?: string;
  }) => {


    dispatch(setNotificationMessage(TRANSLATES[LOCALE].infoSaved));
  };

  return <>
    <form onSubmit={handleSubmit(submitMainInfoForm)}>
      <fieldset className="w-full relative border-2 rounded-md p-4 flex flex-col gap-y-2">
        <legend className="ml-4">{TRANSLATES[LOCALE].userData}</legend>
        <div className="absolute right-4 top-[-28px]">
          {
            mainInfoEditMode
              ? <Button type={ButtonTypes.SUBMIT} styleClass="px-2 py-1" color={ColorOptions.PINK}>
                <div className="flex gap-x-2">
                  <>
                    <Image width={20} height={20} src="/icons/save.svg" alt="Save main info"/>
                    <span>{TRANSLATES[LOCALE].save}</span>
                  </>
                </div>
              </Button>
              : <Button styleClass="px-2 py-1" color={ColorOptions.PINK}
                        callback={() => setMainInfoEditMode((prevState) => (!prevState))}>
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
          mainInfoEditMode
            ? <>
              <InputFormField
                required={true}
                placeholder="Email"
                label="Email"
                name="email"
                type="text"
                error={errors.email?.message}
                register={register}
              />
              <InputFormField
                placeholder={TRANSLATES[LOCALE].enterFio}
                label={TRANSLATES[LOCALE].fio}
                name="name"
                type="text"
                error={errors.name?.message}
                register={register}
              />
              <PhoneFormField
                label={TRANSLATES[LOCALE].enterContactPhoneNumber}
                type="text"
                name="phone"
                error={errors.phone?.message}
                register={register}
              />
              <InputFormField
                placeholder={TRANSLATES[LOCALE].enterDeliveryAddress}
                label={TRANSLATES[LOCALE].deliveryAddress}
                name="deliveryAddress"
                type="text"
                error={errors.deliveryAddress?.message}
                register={register}
              />
            </>
            : <>
              <ReadonlyFormField label="Email" value={user.email}/>
              <ReadonlyFormField label={TRANSLATES[LOCALE].fio} value={user.name}/>
              <ReadonlyFormField label={TRANSLATES[LOCALE].contactPhoneNumber} value={user.phone}/>
              <ReadonlyFormField label={TRANSLATES[LOCALE].deliveryAddress} value={user.deliveryAddress}/>
            </>
        }
      </fieldset>
    </form>
    {/*<fieldset className="w-full border-2 rounded-md p-4">*/}
    {/*  <legend className="ml-4">{TRANSLATES[LOCALE].changePassword}</legend>*/}
    {/*</fieldset>*/}
  </>;
}