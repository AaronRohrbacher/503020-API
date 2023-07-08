const AWS = require('aws-sdk');
const {sendResponse, validateInput} = require('./functions');
const cors = require('cors');
const {application} = require('express');

const cognito = new AWS.CognitoIdentityServiceProvider();

module.exports.handler = async (event) => {
  console.log(event);
  try {
    const isValid = validateInput(event.body);
    if (!isValid) {
      return sendResponse(400, {message: 'Invalid input'});
    }
    console.log(process.env.ENV);
    if (process.env.ENV === 'local') {
      return sendResponse(200, {
        message: 'Success',
        token: {
          ChallengeParameters: {},
          AuthenticationResult: {
            AccessToken: 'eyJraWQiOiJJYkdpSWV0RmRFY2ZWSnBnVUVmajlrYkYycThGTFJITHJ1V1JXaDVaZzk4PSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI3OGExNjNlMC01MDExLTcwZjUtN2M5Yi1iOTUwOTczNjc4ZTkiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtd2VzdC0yLmFtYXpvbmF3cy5jb21cL3VzLXdlc3QtMl82UkJCNjFXQ2siLCJjbGllbnRfaWQiOiI1ZnRpYXBsZHBrcTYxcWp2bXBtN3A2MHJrciIsIm9yaWdpbl9qdGkiOiJhZDI3ZTM2Yi03MTlhLTRhNjYtOWJkYy05ZjFmODU4YzA0Y2MiLCJldmVudF9pZCI6IjRkZGRlMWY4LTc0ZWMtNDc1ZC1hOTIyLWViNzgzNzk3YmUzNCIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE2ODg4NDA4ODUsImV4cCI6MTY4ODg1ODg4NSwiaWF0IjoxNjg4ODQwODg1LCJqdGkiOiI3MjA3Y2Q5ZS05NGUyLTQwNzQtOWFjNS03NThhYzUwMWNiODQiLCJ1c2VybmFtZSI6Ijc4YTE2M2UwLTUwMTEtNzBmNS03YzliLWI5NTA5NzM2NzhlOSJ9.NmW73ytaDM1Ul9hPAAoqPIqn6KRluZyQDI-3rmcmexCnGZzKdGgDlZv7fAUv4aXmg7gHGF8u_wGE0-rs2Tlnn3hwZ8-wJby3a0QYkAknVnzeRWycmVNdvNEPv3-as4WteHguc7iTfv1eb2ykHncduq2m3RSVu0khZFN2BbNczkT4n_TRdOoksa--kkQPrefZwo0mecnixohYMdWC6ySFso83IgdyvOFQLN4JbclELLpdIS7WgTi94awa-OcXiaFGxxVc8ekZaT-v80TWXL-iqZHjniwarSjtxyJ5J22iItgUTD8r2ZyPJvO7C-3qUGYI79HEYAqMIpQBmcg3D_yi_Q',
            ExpiresIn: 18000,
            TokenType: 'Bearer',
            RefreshToken: 'eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUlNBLU9BRVAifQ.UGV8vKPoJwPhWL1XC8IBru0c-jSokzBAZ_uv7c9eSOseFiZ7fUe7iAoWxyVLAEEtxs3MizOrmI9AmyzT1e9y3a5LX6MeThc48RJSsAzh9stvE3ITpryPPty_6yOa8IPICF1JmZzYHlZyUF0Ya5E5qoxnoMPFGbg0y-dlHEbgH2rB6HL1UgU54x2ZDLQxakOOLx3VxdwRtb2mbbMhymC_QwVDTOCbzsf8qRKCgWYeHJXpnugfB8JqhMoNbzvLjmOGEAjgI3BaKeJQXeFj7wzOS6jJPVVgpIjzQpbTw0pgjs7p_VbQP5a55XqH7SogXbw9i1D9eBrFeq0-LZQfEFZzng.sLXjeBJkUVvmYBh1.CZhcjy6FBYixaG2KcOQXk1NHY-yKeuNVY-SJ0VCvDU_h-x6p6tuToksD2lC30wbRl7ygxv72gxtyQ6abRWYY-Hs3Os1Y85ZSu5pVYpsZKbPK1o5i8vMAhjrp8FK92wdJ_OE4XbobYX3F-6wNtTUvpE8nL5Q2j16cq-9zNEoOh78Z6mzUKx3KmgZ8qHSTEsn6jEPkxduNLQIe8tzX7-5oFQMus3uLrqrbt-cWJH2gGh77Erw0aEyNxxMrz7O7OS36dD_mWbZAbG3T_THwsBdbYSEM0WNlXMMSI5VwlPWO2bsK7U1tvbj9SzUOL67knjoO21HvZwoVAXNFGQgiliDDLSi0Pqf1MY3z84VNesvWaqKy_K1A1GIScY0aUosJTxp9WgHIHgoVxDSRMdrI7aIaTX1b-El1o43Nbt4ybrGQExLlEFqHdDG5QH6_npLwNy4ovQwjYdmhuyRHmRisImBH0ypbVfRuh9etB_hhJejby_EWWSZQyRpJKy-iH2Y7k6FleeA73APaf-mqp1fc9clXdloxyUgyTXbg79lUJBnPYRT8qcFg_dgSkXhDE8mzTpIMQGpjMhNR7DdMWTMJr-dQh7C3JSb95Gf50h__q25SD5qKo8VHcuAZ8irUO4D0aIqciZH7H9dpK6s3cE3RfsD4RmP9xr8gmhJdTJoctuTxsAWOv3LKsfR_ZGRiqlz6owb4GD3Y2cxY3kMu5HBUSMX7KJEvTWYwheJGW9f7Gz25cxsY0btv9De_5KCXo3bK9b_g5_u9ZURGx9-i2_TbCQdKPq9Kjm5KPE0oxS3a20zGN0NOjGSQxt8M50cKebj-3gIQPIzPUWr38GMj6yeckS4ESnYr5u2AtF90HLzbIrbda1jp6Aonc4AKgDeLSqmxWAzaIQ2eOMjRtmHHkeY8aiJa3G-BQK_i5CFMN0gGVFvLpah47uh5rxF2fFFU9u9ZerlwqVB1rOWVJ5ctdzzZzhEogw_aoDqKoIKgMWY9Idbej1yDUD3oiMAEE53sh83kGi_8o63JWMKsnGO7_HdW_IQWNZb4ACsOZKVpMMYkQwKikP2hImMIJpliljgOmPwASdlcknHMsjd_b-_XzP6k1Gai3VUaYV9U1S1kHb-y7hT1Z8A7widJ9CRs-yxgrmWzOMR8G45rV_nGtgi637lVMsBlxmzBqHObrvRMn1BUlXx6CX6BF36RO1I_H31r-74WVF6QINICQgO1UEq1aOzkNcBn85awyaMMyDoSn6WuNDNt9ohTdXobpCjj1P-4VgRMnWU9Bsooxo0BgzwxnL_NCbA23HiBEs9BgYqKlz19b_wl8IIfn_asBCaMvWEgnC4.HGHp8y2n8-_9Th5BtjrF4Q',
            IdToken: 'eyJraWQiOiJTT29Edkc0Q3laelwva29hbCtmb3VncjlRNFRlZXpORlcrWnZjdm1sZFhQcz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI3OGExNjNlMC01MDExLTcwZjUtN2M5Yi1iOTUwOTczNjc4ZTkiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLXdlc3QtMi5hbWF6b25hd3MuY29tXC91cy13ZXN0LTJfNlJCQjYxV0NrIiwiY29nbml0bzp1c2VybmFtZSI6Ijc4YTE2M2UwLTUwMTEtNzBmNS03YzliLWI5NTA5NzM2NzhlOSIsIm9yaWdpbl9qdGkiOiJhZDI3ZTM2Yi03MTlhLTRhNjYtOWJkYy05ZjFmODU4YzA0Y2MiLCJhdWQiOiI1ZnRpYXBsZHBrcTYxcWp2bXBtN3A2MHJrciIsImV2ZW50X2lkIjoiNGRkZGUxZjgtNzRlYy00NzVkLWE5MjItZWI3ODM3OTdiZTM0IiwiY3VzdG9tOmZpcnN0TmFtZSI6IkFhcm9uIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE2ODg4NDA4ODUsImV4cCI6MTY4ODg1ODg4NSwiaWF0IjoxNjg4ODQwODg1LCJqdGkiOiI3YTg2OTYxOS0wOWY5LTQwMTAtODZkOS01N2Q5N2FkYWEzZGUiLCJlbWFpbCI6ImFyamF6ekBpY2xvdWQuY29tIn0.m-VgFlWjqsskYCi1kPgMlug8AAR0W6RlXelrVDYEYVrWboXmVC2mi09Wn0zL25VrUg2nxwminkmPuRQfbCr5P5t76Kr7dJJfeHx8cim0dUcgXjHCI6_Li57nEOI4B6IZMFS_W2MdB8kgK3GTrD2wdl4rEat6Sf1jLFBY4Sx30l9hQ7qbThelJPrEVojujvjbiMBoiThxAhqbfx78i65C9npS_anDeqEY3Q5tkGuAGOp3lRsrv3U7iMDb6hBd1UIPJsrcABHHQK4t58271_3IQJYr5G4yasBcHieM68ixp93vyAobzmJ99XcPqnKKqNXREtkiB7lK-2Es-MlWI1FwCg',
          },
        },
      });
    }

    const {username, password} = JSON.parse(event.body);
    const {user_pool_id, client_id} = process.env;
    const params = {
      AuthFlow: 'ADMIN_NO_SRP_AUTH',
      UserPoolId: user_pool_id,
      ClientId: client_id,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    };
    const response = await cognito.adminInitiateAuth(params).promise();
    console.log(response);
    return sendResponse(200, {message: 'Success', token: response});
  } catch (error) {
    const message = error.message ? error.message : 'Internal server error';
    return sendResponse(500, {message});
  }
};
