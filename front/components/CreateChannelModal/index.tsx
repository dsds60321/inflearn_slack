import { Button, Input, Label } from '@pages/SignUp/styles';
import Modal from '@components/Modal';
import React, { useCallback, VFC } from 'react';
import useInput from '@hooks/useInput';
import axios from 'axios';
import workspace from '@layouts/Workspace';
import { useParams } from 'react-router';
import useSWR from 'swr';
import { IChannel, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';

interface Props {
  show: boolean;
  onCloseModal: () => void;
  setShowCreateChannelModal: (flag: boolean) => void;
}

const CreateChannelModal: VFC<Props> = ({ show, onCloseModal, setShowCreateChannelModal }) => {
  const [newChannel, onChangeNewChannel, setNewChannel] = useInput('');
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>();
  const { data: userData, error, mutate } = useSWR<IUser | false>('/api/users', fetcher);
  const { mutate: revalidateChannel } = useSWR<IChannel[] | null>(
    userData ? `/api/workspaces/${workspace}/channels` : null,
    fetcher,
  );
  const onCreateChannel = useCallback((e) => {
    e.preventDefault();
    axios
      .post(`/api/workspaces/${workspace}/channels`, {
        name: newChannel,
      })
      .then(() => {
        setShowCreateChannelModal(false);
        revalidateChannel();
        setNewChannel('');
      })
      .catch((error) => {
        console.dir(error);
      });
  }, []);
  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onCreateChannel}>
        <Label id="channel-label">
          <span>채널</span>
          <Input id="channel" value={newChannel} onChange={onChangeNewChannel} />
        </Label>
        <Button type="submit">생성하기</Button>
      </form>
    </Modal>
  );
};

export default CreateChannelModal;
