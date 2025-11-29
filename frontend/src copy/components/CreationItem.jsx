import React, { useState } from "react";
import Markdown from "react-markdown";

const CreationItem = ({ item }) => {
    const [expanded, setExpanded] = useState(false)

    return (
        <div  onClick={()=>setExpanded(!expanded)}
        role="button"
        area-expended={expanded} 
        className="p-4 max-w-5xl text-sm bg-gray-100 border border-gray-200 rounded-b-lg cursor-pointer">
            <div className="flex items-center justify-baseline gap-4">
                <div>
                    <header>
                    <h2>{item.prompt}</h2>
                    <p className="text-gray-500">
                        {item.type} - {new Date(item.created_at).toLocaleDateString()}
                    </p>
                    </header>
                </div>
                <button className="bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E40AF] px-4 py-1 rounded-full">{item.type}</button>
            </div>
            {
                expanded && (
                    <div>
                        {item.type === 'image' ? (
                            <div>
                                <img src={item.content} alt={`Generated ${item.type}`} className="mt-4 w-full max-w-md" />
                            </div>
                        ) : (
                            <div className="mt-4 h-full overflow-y-scroll text-sm text-slate-700">
                                <div className="reset-tw">
                                <Markdown>{item.content}</Markdown>
                                </div>
                            </div>
                        )
                        }
                    </div>
                )
            }
        </div>
    )
}
export default CreationItem