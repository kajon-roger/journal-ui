import React, { useState, useEffect } from "react";

import { ID, ComponentType } from "../utils/ID";
import { LogbookAPIPromise } from "../modules/LogbookAPIPromise";

interface Props {
    loggedInCallback: LoggedInCallback,
}

export function Login(props: Props) {

    let [ lastLoginFailed, setLastLoginFailed ] = useState(false);

    useEffect(() => {
        (document.getElementById(createUserEmailId()) as HTMLInputElement).focus();
    },
    []); // Empty array of dependencies = only run when the component mounts (like the class component method componentDidMount())
         // Note that no array here woud cause the method above to run on every render of the component

    
    let createUserEmailId = (): string => {
        return ID.createId(undefined, ComponentType.LOGIN ,"user_email");
    }
    
    let createUserPasswordId = (): string => {
        return ID.createId(undefined, ComponentType.LOGIN ,"user_password");
    }

    let getUserEmail = (): string => {
        let retval: string = (document.getElementById(createUserEmailId()) as HTMLInputElement).value;
        (document.getElementById(createUserEmailId()) as HTMLInputElement).value = '';
        return retval;
    }

    let getUserPassword = (): string => {
        let retval: string = (document.getElementById(createUserPasswordId()) as HTMLInputElement).value;
        (document.getElementById(createUserPasswordId()) as HTMLInputElement).value = '';
        return retval;
    }

    let signIn = (e: React.MouseEvent<HTMLInputElement, MouseEvent>): void => {

        e.preventDefault();
        e.stopPropagation();

        let userEmail = getUserEmail();
        let userPassword = getUserPassword();
        
        LogbookAPIPromise.login(userEmail, userPassword)
        .then((success) => {


            setLastLoginFailed(!success);

            if (success) {

                props.loggedInCallback();
            }
        })
    }

    let getLoginFailed = (): React.ReactNode => {

        console.log(`Login.getLoginFailed() lastLoginFailed: ${lastLoginFailed}`);

        return (

            lastLoginFailed
            ?
            <div className="row col-lg-2">
                <p style={{color: "red"}}>Unauthorised</p>
            </div>
            :
            ``
        );
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-lg-1" style={{textAlign: "right"}}>
                    Email:
                </div>
                <div className="col-lg-1">
                    <input type="text" id={createUserEmailId()}></input>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-1" style={{textAlign: "right"}}>
                    Password:
                </div>
                <div className="col-lg-1">
                    <input type="password" id={createUserPasswordId()} ></input>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-1">
                </div>
                <div className="col-lg-1">
                    <input type="button" value="Sign in" style={{width: "100px"}} onClick={ (e) => signIn(e) }></input>
                </div>
            </div>
            {
                getLoginFailed()
            }
        </div>
    );
}

export interface LoggedInCallback {
    (): void;
}
