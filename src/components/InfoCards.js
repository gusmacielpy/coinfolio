import React from "react";

const InfoCards = ({ infoCards }) => {
  return (
    <div className="col-sm-9 text-center text-lg-start lh-1">
      <div className="row g-3">
        {infoCards.length > 0 &&
          infoCards.map((infocard, i) => (
            <div className="col-12 col-md-6 col-lg-auto" key={i}>
              <div className="card" style={{ backgroundColor: "#1E1E1E" }}>
                <div className="card-body">
                  <h5 className="card-title" style={{ color: "#CCCCCC" }}>
                    {infocard.value.inNumber}
                  </h5>
                  <span className="card-text" style={{ color: "#A5A5A5" }}>
                    {infocard.subTitle}

                    {infocard.value.inPct !== "" && (
                      <label
                        style={{
                          color: `${
                            infocard.value.inPct <= 0 ? "#E15241" : "#8DC647"
                          }`,
                        }}
                      >
                        &nbsp;({infocard.value.inPct}%)
                      </label>
                    )}
                  </span>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default InfoCards;
