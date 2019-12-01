const awsConfig = {
    Auth: {
        identityPoolId: '', // example: 'us-east-2:c85f3c18-05fd-4bb5-8fd1-e77e7627a99e'
        userPoolId: '', // example: 'us-east-2_teEUQbkUh'
        userPoolWebClientId: '',  // example: '3k09ptd8kn8qk2hpk07qopr86'
        region: 'us-west-2', // example: 'us-east-2'
        mandatorySignIn: true
    },
    API: {
        endpoints: [
            {
                name: 'NeptuneAPI',
                endpoint: '', //example: 'https://kj53ynp3i4.execute-api.us-west-2.amazonaws.com/Prod'
                region: 'us-west-2' // example: 'us-east-2'
            }
        ]
    },
    Storage: {
        documentBucket: '',
        documentBucketRegion: 'us-west-2', // example: 'us-east-2'
        documentPrefix: 'data/translated/politics-2000/'
    }
}

export default awsConfig;
