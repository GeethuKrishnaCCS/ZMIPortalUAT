import * as React from 'react';
import toast from 'react-simple-toasts';
import styles from './Toast.module.scss';

function error(msg) {
    return <div className={styles.error}>{msg}</div>
}

function info(msg) {
    return <div className={styles.info}>{msg}</div>
}

function warning(msg) {
    return <div className={styles.warning}>{msg}</div>
}

function success(msg) {
    return <div className={styles.success}>{msg}</div>
}

function Toast(type, message) {
    return toast(message, {
        render: message => <>{type === "error" && error(message)}
            {type === "info" && info(message)}
            {type === "warning" && warning(message)}
            {type === "success" && success(message)}</>,
        time: 4000
    });
}

export default Toast;
