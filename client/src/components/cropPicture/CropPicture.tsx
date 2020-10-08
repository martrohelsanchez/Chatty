import React, { useState } from 'react';
import Cropper from 'react-easy-crop';
import {Area} from 'react-easy-crop/types'

import {storage} from 'firebaseConfig';
import * as S from './CropPicture.styles';
import cancelIcon from 'images/cancel.svg';
import nextIcon from 'images/next.svg';
import Loading from 'components/loading/Loading';
import {updateHeaderReq, updateProfilePicReq} from 'api/APIUtils';

import {useSelector, useDispatch} from 'react-redux';
import {rootState} from 'redux/store';
import {updateGroupHeader, updateGroupPic} from 'redux/actions/conversationsActions';
import {updateUserHeader, updateUserProfilePic} from 'redux/actions/userInfoActions';

interface CropPictureProps {
    isSettingHeader: boolean;
    isSettingProfile: boolean;
    close: () => void;
    imagePrev: string;
    group?: {
        convId: string
    };
}

const createImage = (url: string): Promise<HTMLImageElement> => {
    return new Promise((res, rej) => {
        const img = document.createElement('img');
        img.src = url;
        img.setAttribute('crossOrigin', 'anonymous');
        img.addEventListener('load', () => res(img));
    })
}

const getCroppedImg = (image: HTMLImageElement, crop: Area): Promise<Blob> => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    if (ctx) {
        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height,
        );
    }

    return new Promise((resolve, reject) => {
        canvas.toBlob(blob => {
            if (blob) {
                resolve(blob);
            }
        }, 'image/jpeg', 1);
    });
}

const CropPicture = ({isSettingHeader, imagePrev, close, group}: CropPictureProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const user = useSelector((state: rootState) => state.userInfo);
    const [zoom, setZoom] = useState(1); 
    const [crop, setCrop] = useState({x: 0, y: 0});
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>(null!);
    const aspect = isSettingHeader ? 400.5 / 198.05 : 1 / 1;
    const dispatch = useDispatch();
    const [err, setErr] = useState<Error | null>(null);

    const uploadImage = async (imageFile: Blob) => {
        const storageRef = storage.ref();
        const imageRef = storageRef.child(`${user.userId}/${isSettingHeader ? 'header' : 'profile'}.jpg`);

       await imageRef.put(imageFile);
       return imageRef.getDownloadURL();
    }

    const onNextClick = async () => {
        setIsLoading(true);
        try {
            const image = await createImage(imagePrev);
            const croppedImg = await getCroppedImg(image, croppedAreaPixels);

            const imageUrl = await uploadImage(croppedImg);

            if (isSettingHeader) {
                setHeaderPic(URL.createObjectURL(croppedImg), imageUrl);
            } else {
                setProfilePic(URL.createObjectURL(croppedImg), imageUrl);
            }

            setIsLoading(false);
            close();
        } catch (err) {
            console.log(err);
        }
    }

    const setHeaderPic = async (imageObjUrl: string, imageUrl: string) => {
        try {
            const id = group ? group.convId : user.userId;
            await updateHeaderReq(group ? true : false, imageUrl, id);
            if (group) {
                dispatch(updateGroupHeader(group.convId as string, imageObjUrl));
            } else {
                dispatch(updateUserHeader(imageObjUrl));
            }
        } catch (err) {
            console.error(err);
            setErr(err);
        }
    }

    const setProfilePic = async (imageObjUrl: string, imageUrl: string) => {
        try {
            const id = group ? group.convId : user.userId;
            await updateProfilePicReq(group ? true : false, imageUrl, id);
            if (group) {
                dispatch(updateGroupPic(group.convId as string, imageObjUrl))
            } else {
                dispatch(updateUserProfilePic(imageObjUrl));
            }
        } catch (err) {
            console.error(err);
            setErr(err);
        }
    }

    const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }

    if (err) {
        close();
    }

    return (
        <S.PopUpContainer>
            <S.PopUp>
                <div style={{flex: '1 1 40px'}}></div>
                <S.CropperContainer>
                    <Cropper
                        image={imagePrev}
                        zoom={zoom}
                        onZoomChange={setZoom}
                        crop={crop}
                        onCropChange={setCrop}
                        aspect={aspect}
                        onCropComplete={onCropComplete}
                    />
                </S.CropperContainer>
                <S.BtnsContainer>
                    {isLoading ? (
                        <Loading />
                    ) : (
                        <>
                            <S.Cancel onClick={() => close()} src={cancelIcon} />
                            <S.NextBtn src={nextIcon} onClick={onNextClick} />
                        </>
                    )}
                </S.BtnsContainer>
            </S.PopUp>
        </S.PopUpContainer>
    )
}

export default CropPicture;