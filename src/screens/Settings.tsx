import { sendEmailVerification } from 'firebase/auth';
import React, { useState, useEffect, useRef } from 'react';
import Modal from '../components/Modal';
import { StravaConnect } from '../components/StravaConnect';
import { firebaseConfig } from '../config';
import { useUser } from '../hooks/useUser';

const url =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/signup/confirm'
    : `https://${firebaseConfig.authDomain}/signup/confirm`;

const Profile = () => {
  const { user } = useUser();
  const [modal, setModal] = useState<{
    type: 'disconnect' | 'delete';
    source?: string;
  } | null>(null);
  const settingsRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [resendingEmail, setResendingEmail] = useState(false);

  const stravaProfile = user?.strava?.athlete;

  const resendEmail = async () => {
    if (resendingEmail) {
      return;
    }
    if (user) {
      setResendingEmail(true);
      try {
        await sendEmailVerification(user, {
          url: `${url}?email=${user.email}`,
          handleCodeInApp: true,
        });
        setResendingEmail(false);
      } catch (e) {
        setResendingEmail(false);
        setErrorMessage('Failed to resend, please try again');
      }
    }
  };

  useEffect(() => {
    const cancel = (e: MouseEvent) => {
      e.preventDefault();
      if (!settingsRef.current) {
        return;
      }
      if (e.target && !(e.target as Node).contains(settingsRef.current)) {
        return;
      }
      setModal(null);
      setErrorMessage('');
      setIsLoading(false);
    };
    document.addEventListener('mousedown', cancel);
    return () => {
      document.removeEventListener('mousedown', cancel);
    };
  }, []);

  const onClickDelete = () => {
    console.log('Delete Account Clicked');
    setModal({ type: 'delete' });
  };

  const onClickDisconnect = (integration: string) => {
    console.log(`Disconnect ${integration} Account Clicked`);
    setModal({ type: 'disconnect', source: integration });
  };

  const handleRevoke = () => {
    setIsLoading(true);
    switch (modal?.type) {
      case 'disconnect':
        break;
      case 'delete':
        setIsLoading(false);
        break;
      default:
        setIsLoading(false);
        break;
    }
  };

  const modalContent = () => {
    if (modal && modal.type && modal.type === 'delete') {
      return (
        <div>Are you sure you want to delete your Cycle Saver account?</div>
      );
    } else if (modal && modal.type && modal.type === 'disconnect') {
      return (
        <div>
          Are you sure you want to disconnect your {modal.source} account?
        </div>
      );
    }
    return null;
  };

  return (
    <div className={modal ? 'Settings-hide' : 'Settings'} ref={settingsRef}>
      <h3>Settings</h3>
      <div>User ID: {user?.uid}</div>
      <div>Email: {user?.email}</div>
      <button onClick={() => onClickDelete()}>Delete Account</button>
      <h4>Integrations</h4>
      {stravaProfile ? (
        <>
          <h5>Strava</h5>
          <div>Athlete ID: {stravaProfile.id}</div>
          <div>Username: {stravaProfile.username}</div>
          <button onClick={() => onClickDisconnect('strava')}>
            Disconnect Strava
          </button>
        </>
      ) : (
        <StravaConnect />
      )}
      <Modal
        show={!!modal}
        className='SettingsModal'
        onHide={() => setModal(null)}
        onConfirm={handleRevoke}
        isLoading={isLoading}
        errorMessage={errorMessage}
      >
        {modalContent()}
      </Modal>
      <div>
        {user && !user.emailVerified && (
          <span
            className={resendingEmail ? '' : 'clickable'}
            onClick={resendEmail}
          >
            Please click here to verify your email
          </span>
        )}
      </div>
    </div>
  );
};

export default Profile;
