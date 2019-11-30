// const awsConfig = {
//     Auth: {
//         identityPoolId: 'us-east-1:09a3193c-d4ce-42a1-9721-6ced2f8f4339', // example: 'us-east-2:c85f3c18-05fd-4bb5-8fd1-e77e7627a99e'
//         region: 'us-east-1', // example: 'us-east-2'
//         userPoolId: 'us-east-1_eCcLFEjSc', // example: 'us-east-2_teEUQbkUh'
//         userPoolWebClientId: '18hc4ha13ogqk288embfqaid1i',  // example: '3k09ptd8kn8qk2hpk07qopr86'
//         mandatorySignIn: true
//     },
//     API: {
//         endpoints: [
//             {
//                 name: 'NeptuneAPI',
//                 endpoint: 'https://uoiv26ru7c.execute-api.us-east-1.amazonaws.com/Prod',
//                 region: 'us-east-1' // example: 'us-east-2'
//             }
//         ]
//     },
//     Storage: {
//         bucket: 'graphvisualizer1f244a33ba994a60bea69e93da45eb72-dev', //example: 'wildrydesbackend-profilepicturesbucket-1wgssc97ekdph'
//         region: 'us-east-1', // example: 'us-east-2'
//         documentBucket: 'angelaw-chinese-news-analysis',
//         documentBucketRegion: 'us-east-1',
//         documentPrefix: 'Translated/input/THUCNews/时政/'
//     }
// }

const awsConfig = {
    Auth: {
        identityPoolId: 'us-west-2:49560a29-f001-4a80-b50f-31c20f28df28', // example: 'us-east-2:c85f3c18-05fd-4bb5-8fd1-e77e7627a99e'
        region: 'us-west-2', // example: 'us-east-2'
        userPoolId: 'us-west-2_W6TOneY9s', // example: 'us-east-2_teEUQbkUh'
        userPoolWebClientId: '2u9op91hm52oj7j7onmdvgfa9f',  // example: '3k09ptd8kn8qk2hpk07qopr86'
        mandatorySignIn: true
    },
    API: {
        endpoints: [
            {
                name: 'NeptuneAPI',
                endpoint: 'https://s3an4nxu13.execute-api.us-west-2.amazonaws.com/Prod',
                region: 'us-west-2' // example: 'us-east-2'
            }
        ]
    },
    Storage: {
        bucket: 'graphvisualizer1f244a33ba994a60bea69e93da45eb72-dev', //example: 'wildrydesbackend-profilepicturesbucket-1wgssc97ekdph'
        region: 'us-east-1', // example: 'us-east-2'
        documentBucket: 'angelaw-chinese-news-analysis',
        documentBucketRegion: 'us-east-1',
        documentPrefix: 'Translated/input/THUCNews/时政/'
    }
}


export default awsConfig;
