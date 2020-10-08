import React, {useState, useRef, useLayoutEffect} from 'react';

import * as S from './UserInfo.styles';
import cross from 'images/cross.svg';
import CropPicture from 'components/cropPicture/CropPicture';
import {updateBioReq} from 'api/APIUtils';

import {useSelector, useDispatch} from 'react-redux';
import {rootState} from 'redux/store';
import {updateGroupBio} from 'redux/actions/conversationsActions';
import {updateUserBio} from 'redux/actions/userInfoActions';

interface UserInfoProps {
    convName?: string,
    bio?: string,
    profilePic?: string,
    header?: string
    isSetUserScreen: boolean;
    group?: {
      convId: string
    }
    className?: string;
}

const UserInfo = ({
  convName, bio,
  profilePic, header,
  isSetUserScreen, className,
  group
}: UserInfoProps) => {
  const user = useSelector((state: rootState) => state.userInfo);
  const [isBioInput, setIsBioInput] = useState(false);
  const [bioInput, setBioInput] = useState('');
  const bioInputRef = useRef<HTMLTextAreaElement>(null!)
  const fileInputRef = useRef<HTMLInputElement>(null!);
  const lastImageInput = useRef<'header' | 'profile' | 'none'>('none');
  const [isSettingHeader, setIsSettingHeader] = useState(false);
  const [isSettingProfile, setIsSettingProfile] = useState(false);
  const [imageFile, setImageFile] = useState<File>(null!);
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    if (isBioInput) {
      bioInputRef.current.focus();
    }
  }, [isBioInput])

  const onBioInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBioInput(e.target.value);

    e.target.style.height = "5px";
    e.target.style.height = (e.target.scrollHeight) + "px";
  }

  const onBioClick = () => {
    if (isSetUserScreen || group) {
      setIsBioInput(true);
    }
  }

  const onBioInputBlur = async () => {
    const isGroupChat = group ? true : false;
    setIsBioInput(false);

    //Update bio in db
    if (group) {
      await updateBioReq(isGroupChat, bioInput, group.convId);
      dispatch(updateGroupBio(group.convId, bioInput));
    } else {
      await updateBioReq(isGroupChat, bioInput, user.userId);
      dispatch(updateUserBio(bioInput));
    }
  }

  const onHeaderClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    if (e.currentTarget.classList.contains('header') && (isSetUserScreen || group)) {
      lastImageInput.current = 'header';
      fileInputRef.current.click();
    }
  }

  const onProfileClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    if (e.currentTarget.classList.contains('profile') && (isSetUserScreen || group)) {
      lastImageInput.current = 'profile';
      fileInputRef.current.click();
    }
  }

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (setImageFile && e.target.files) {
      setImageFile(e.target.files[0]);
    } else {
      return null;
    }

    if (lastImageInput.current === 'header' && (setIsSettingHeader || group)) {
      setIsSettingHeader(true);
    } else if (lastImageInput.current === 'profile' && (setIsSettingHeader || group)) {
      setIsSettingProfile(true);
    }

    e.currentTarget.value = '';
  }

  const onClose = () => {
    setIsSettingHeader(false);
    setIsSettingProfile(false);
  }

  return (
    <>
      {isSettingProfile || isSettingHeader ? (
        <CropPicture
          isSettingHeader={isSettingHeader}
          isSettingProfile={isSettingHeader}
          imagePrev={URL.createObjectURL(imageFile)}
          close={onClose}
          group={group}
        />
      ) : (
        null
      )}
      <S.UserInfoCont>
        <S.Header 
          className='header'
          pic={header} 
          isSetUserScreen={isSetUserScreen}
          onClick={onHeaderClick}
        >
          {!header && isSetUserScreen ? (
            <S.Cross src={cross} />
          ) : (
            null
          )}
          <S.OuterCircle
            className='profile'
            onClick={onProfileClick}
          >
            <S.ConvPic pic={profilePic}>
              {!profilePic && isSetUserScreen ? (
                <S.Cross style={{height: '25%'}} src={cross} />
              ) : (
                null
              )}
            </S.ConvPic>
          </S.OuterCircle>
        </S.Header>  
        <S.BioContainer isSetUserScreen={isSetUserScreen}>
          <S.ConvName>
            {convName}
          </S.ConvName>
          {isBioInput ? (
            <S.BioInput 
              ref={bioInputRef}
              value={bioInput}
              onChange={onBioInputChange}
              onBlur={onBioInputBlur}
            />
          ) : (
            <S.Bio onClick={onBioClick}>
              {!bio && (isSetUserScreen || group) ? (
                bioInput ? (
                  bioInput
                ) : (
                  'Edit bio'
                )
              ) : (
                bio
              )}
            </S.Bio>
          )}
        </S.BioContainer>
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ opacity: "0" }} 
        onChange={onFileInputChange}
        multiple
        accept="image/*"
      />
      </S.UserInfoCont>       
    </>
  )
}

export default UserInfo;