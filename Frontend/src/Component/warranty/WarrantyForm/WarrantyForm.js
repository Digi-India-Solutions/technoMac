import Breadcrumb from "../../common/Breadcrumb/Breadcrumb";
import styles from "./WarrantyForm.module.css";
import {
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaClinicMedical,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaHashtag,
  FaBuilding,
  FaUpload,
  FaShieldAlt,
  FaCheckCircle,
} from "react-icons/fa";

export default function WarrantyForm() {

  return (

    <section className={styles.warrantySection}>

      {/* BACKGROUND GLOW */}

      <div className={styles.glow}></div>

      <div className="container">

        <Breadcrumb pageName="Extend Warranty" />

        {/* TOP CONTENT */}

        <div className={styles.heading}>

          <span>
            TECHNOMAC WARRANTY
          </span>

          <h1>
            Warranty Registration Form
          </h1>

          <p>
            Thank you for choosing our
            product and registering your
            warranty with TECHNOMAC.
            Register your equipment to
            receive fast support, warranty
            service assistance and priority
            technical support from our team.
          </p>

        </div>

        {/* INFO CARDS */}

        <div className="row mb-5">

          <div className="col-lg-4 col-md-6 mb-4">

            <div className={styles.infoCard}>

              <FaShieldAlt />

              <h4>
                Product Protection
              </h4>

              <p>
                Get official warranty
                protection for your
                TECHNOMAC products.
              </p>

            </div>

          </div>

          <div className="col-lg-4 col-md-6 mb-4">

            <div className={styles.infoCard}>

              <FaCheckCircle />

              <h4>
                Fast Service Support
              </h4>

              <p>
                Receive quick technical
                support and faster
                service processing.
              </p>

            </div>

          </div>

          <div className="col-lg-4 col-md-6 mb-4">

            <div className={styles.infoCard}>

              <FaClinicMedical />

              <h4>
                Trusted Healthcare
              </h4>

              <p>
                Supporting modern dental
                clinics with premium
                healthcare solutions.
              </p>

            </div>

          </div>

        </div>

        {/* FORM CARD */}

        <div className={styles.formCard}>

        <form>

  <div className="row">

    {/* EMAIL */}

    <div className="col-lg-6">

      <div className={styles.formField}>

        <label>
          Email Address *
        </label>

        <div className={styles.inputGroup}>

          <FaEnvelope />

          <input
            type="email"
            placeholder="Enter Email Address"
            required
          />

        </div>

      </div>

    </div>

    {/* CUSTOMER NAME */}

    <div className="col-lg-6">

      <div className={styles.formField}>

        <label>
          Customer Name *
        </label>

        <div className={styles.inputGroup}>

          <FaUser />

          <input
            type="text"
            placeholder="Enter Customer Name"
            required
          />

        </div>

      </div>

    </div>

    {/* CLINIC NAME */}

    <div className="col-lg-6">

      <div className={styles.formField}>

        <label>
          Clinic Name *
        </label>

        <div className={styles.inputGroup}>

          <FaClinicMedical />

          <input
            type="text"
            placeholder="Enter Clinic Name"
            required
          />

        </div>

      </div>

    </div>

    {/* CONTACT */}

    <div className="col-lg-6">

      <div className={styles.formField}>

        <label>
          Customer Contact *
        </label>

        <div className={styles.inputGroup}>

          <FaPhoneAlt />

          <input
            type="text"
            placeholder="Enter Contact Number"
            required
          />

        </div>

      </div>

    </div>

    {/* ADDRESS */}

    <div className="col-lg-12">

      <div className={styles.formField}>

        <label>
          Clinic Address *
        </label>

        <div className={styles.inputGroup}>

          <FaMapMarkerAlt />

          <textarea
            placeholder="Enter Clinic Address"
            required
          ></textarea>

        </div>

      </div>

    </div>

    {/* PURCHASE DATE */}

    <div className="col-lg-6">

      <div className={styles.formField}>

        <label>
          Purchase Date *
        </label>

        <div className={styles.inputGroup}>

          <FaCalendarAlt />

          <input
            type="date"
            required
          />

        </div>

      </div>

    </div>

    {/* MODEL */}

    <div className="col-lg-6">

      <div className={styles.formField}>

        <label>
          Product Model *
        </label>

        <div className={styles.inputGroup}>

          <FaBuilding />

          <select required>

            <option value="">
              Select Product Model
            </option>

            <option>
              MR-01/70 Wall Model
            </option>

            <option>
              MR-01/60 Wall Model
            </option>

            <option>
              MR-01 Floor Model
            </option>

            <option>
              Cliq-X Portable X-Ray
            </option>

            <option>
              Garuda Dental Chair
            </option>

            <option>
              Garuda Plus Dental Chair
            </option>

            <option>
              UV Cabinet
            </option>

            <option>
              Auto Clave
            </option>

            <option>
              RVG Sensor
            </option>

          </select>

        </div>

      </div>

    </div>

    {/* SERIAL NUMBER */}

    <div className="col-lg-6">

      <div className={styles.formField}>

        <label>
          Serial Number *
        </label>

        <div className={styles.inputGroup}>

          <FaHashtag />

          <input
            type="text"
            placeholder="Enter Serial Number"
            required
          />

        </div>

      </div>

    </div>

    {/* DEALER NAME */}

    <div className="col-lg-6">

      <div className={styles.formField}>

        <label>
          Dealer Name *
        </label>

        <div className={styles.inputGroup}>

          <FaUser />

          <input
            type="text"
            placeholder="Enter Dealer Name"
            required
          />

        </div>

      </div>

    </div>

    {/* DEALER COMPANY */}

    <div className="col-lg-6">

      <div className={styles.formField}>

        <label>
          Dealer Company *
        </label>

        <div className={styles.inputGroup}>

          <FaBuilding />

          <input
            type="text"
            placeholder="Enter Dealer Company"
            required
          />

        </div>

      </div>

    </div>

    {/* DEALER CONTACT */}

    <div className="col-lg-6">

      <div className={styles.formField}>

        <label>
          Dealer Contact *
        </label>

        <div className={styles.inputGroup}>

          <FaPhoneAlt />

          <input
            type="text"
            placeholder="Enter Dealer Contact"
            required
          />

        </div>

      </div>

    </div>

    {/* DEALER ADDRESS */}

    <div className="col-lg-12">

      <div className={styles.formField}>

        <label>
          Dealer Address *
        </label>

        <div className={styles.inputGroup}>

          <FaMapMarkerAlt />

          <textarea
            placeholder="Enter Dealer Address"
            required
          ></textarea>

        </div>

      </div>

    </div>

    {/* FILE UPLOAD */}

    <div className="col-lg-12">

      <div className={styles.formField}>

        <label>
          Upload Installed Product Image *
        </label>

        <div className={styles.uploadBox}>

          <FaUpload />

          <h4>
            Upload Product Image
          </h4>

          <p>
            Upload image of installed
            X-ray machine or product.
          </p>

          <input
            type="file"
            accept="image/*"
          />

        </div>

      </div>

    </div>

  </div>

  {/* BUTTON */}

  <button
    type="submit"
    className={styles.submitBtn}
  >

    Submit Warranty Registration

  </button>

</form>

        </div>

      </div>

    </section>
  );
}