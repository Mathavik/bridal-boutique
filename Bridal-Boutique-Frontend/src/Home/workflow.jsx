import React from "react";
import workflowImage from "../assets/workflow/workflow.png";

function Workflow() {
  return (
    <section className="w-full bg-white border-y border-gray-200">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex justify-center items-center py-6 md:py-8 lg:py-10">
          <img
            src={workflowImage}
            alt="Workflow"
            className="
              w-full
              max-w-[850px]
              h-auto
              object-contain
              select-none
              pointer-events-none
            "
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}

export default Workflow;