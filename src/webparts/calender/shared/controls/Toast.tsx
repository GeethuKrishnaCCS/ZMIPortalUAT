import * as React from 'react';
import toast from 'react-simple-toasts';
import styles from './Toast.module.scss';

function error(msg: any) {
    return <div className={styles.error}>{msg}</div>
}

function info(msg: any) {
    return <div className={styles.info}>{msg}</div>
}

function warning(msg: any) {
    return <div className={styles.warning}>{msg}</div>
}

function success(msg: any) {
    return <div className={styles.success}>{msg}</div>
}

function Toast(type: string, message: any) {
    return toast(message, {
        render: message => <>{type === "error" && error(message)}
            {type === "info" && info(message)}
            {type === "warning" && warning(message)}
            {type === "success" && success(message)}</>,
        time: 4000
    });
}

export default Toast;
