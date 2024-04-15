// ========== 현재 안씀 ===========//

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation } from 'react-query';

import Top from 'components/admin/Top';
import Loading from 'components/loding/Loading';

import * as Common from 'assets/styleComponent/admin/common'

const UserDetail = () => {

    return (
        <>
            <Top title={"회원 정보"} isButton={false} />
        </>
    );
};

export default UserDetail;