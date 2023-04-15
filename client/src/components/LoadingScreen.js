
import { FidgetSpinner } from  'react-loader-spinner'

export default function LoadingScreen(){
    return(
        <>
            <div className="bg-white flex justify-center items-center h-screen">
            <FidgetSpinner
                visible={true}
                height="100"
                width="100"
                ariaLabel="dna-loading"
                wrapperStyle={{}}
                wrapperClass="dna-wrapper"
                ballColors={['#93C5FD', '#93C5FD', '#93C5FD']}
                backgroundColor="#93C5FD"
            />
            </div>
        </>
    )
}