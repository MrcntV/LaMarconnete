import { BiSolidContact, BiMap } from 'react-icons/bi'
import { FaPhoneAlt } from 'react-icons/fa'



const Contact = () => {
    return (
        <main>
            <section>
                <h1>Nous contacter</h1>
                <div className="htmlFormulaireContact">
                    <div className='Colonne50'>
                        <h2>Une Question ? </h2>
                        <p>Pour nous envoyer un message, remplissez ce htmlFormulaire et nous reviendrons très vite vers vous !</p>
                        <div className='Horizontale'>
                            <div className='ColonneCentre'>
                                <BiSolidContact style={{ fontSize: '3em', color: "#546863" }} />
                                <p>contact@lamarconnete.fr</p>
                            </div>
                            <div className='ColonneCentre'>
                                <FaPhoneAlt style={{ fontSize: '3em', color: "#546863" }} />
                                <p>(+33) 6 28 58 58 19</p>
                                <p> Du lundi au vendredi de 9h00 à 18h00</p>
                            </div>
                            <div className='ColonneCentre'>
                                <BiMap style={{ fontSize: '3em', color: "#546863" }} />
                                <p>206, route de Saint-Antoine 06200 Nice (FRANCE)</p>
                            </div>
                        </div>
                        <img src="images/Mascottes/Mascotte_renard_v3.png" alt="" />
                    </div>
                    <div className='Colonne50'>
                        <form action="" id="htmlForm" method="post" >
                            <div className="">

                                <div className="" id="" data--type="select" data--id="" data--required="">
                                    <div className="">
                                        <div className="">
                                            <label htmlFor="" className="">
                                                <span className="">Je suis un</span>
                                            </label>
                                        </div>
                                        <div className="">
                                            <select name="" data-serialize className='' required>
                                                <option disabled hidden selected value='' className="">Choisir</option>
                                                <option value="0" id="">Particulier </option>
                                                <option value="1" id="">Professionnel </option>
                                                <option value="2" id="">Autre </option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="" id="" data--type="select" data--id="" data--required="">

                                    <div className="">
                                        <label htmlFor="9" className="">
                                            <span className="">Ma demande concerne</span>
                                        </label>
                                    </div>

                                    <div className="">

                                        <select name="" data-serialize className='' required>
                                            <option disabled hidden selected value='' className="">Choisir</option>
                                            <option value="0" id="">Une question sur nos produits ou notre marque </option>
                                            <option value="1" id="">Une demande de partenariat </option>
                                            <option value="2" id="">Le suivi de votre commande </option>
                                            <option value="3" id="">Une réclamation suite à une commande </option>
                                            <option value="4" id="">Une autre question </option>
                                        </select>
                                    </div>

                                </div>
                                <div className="" id="" data--type="single_line_text" data--id="" data--required="">
                                    <div className="">
                                        <div className="">
                                            <label htmlFor="" className="">
                                                <span className="label">Nom</span>
                                            </label>
                                        </div>
                                        <div className="">
                                            <input className="FormulaireContact" id="" type="text" name="578_" value="" placeholder="" />
                                        </div>
                                    </div>
                                </div>
                                <div className="" id="" data--type="" data--id="" data--required="">
                                    <div className="-part-wrap">

                                        <div className="">
                                            <label htmlFor="" className="">
                                                <span className="label">Prénom</span>
                                            </label>
                                        </div>


                                        <div className="">
                                            <input className="FormulaireContact" id="" type="text" name="" value="" placeholder="" />
                                        </div>
                                    </div>
                                </div>
                                <div className="" id="" data--type="" data--id="" data--required="">
                                    <div className="-part-wrap">

                                        <div className="">
                                            <label htmlFor="" className="">
                                                <span className="label">E-mail</span>
                                            </label>
                                        </div>
                                        <div className="">
                                            <div className="">

                                                <input className="FormulaireContact" id="" type="text" name="" value="" placeholder="" />
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div className="" id="" data--type="" data--id="" data--required="">
                                    <div className="">

                                        <div className="">
                                            <label htmlFor="" className="">
                                                <span className="">Téléphone</span>
                                            </label>
                                        </div>


                                        <div className="">


                                            <div className="">

                                                <input className="FormulaireContact" id="" type="text" name="5" value="" placeholder="" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="" id="" >
                                    <div className="">
                                        <div className="">
                                            <label htmlFor="" className="">
                                                <span className="">Votre message</span>
                                                <span className=""></span>
                                            </label>
                                        </div>
                                        <div className="">
                                            <textarea
                                                id=""
                                                name=""
                                                placeholder=""
                                                style={{ width: '100%', height: '150px', resize: 'none' }}
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div className="">
                                    <button type="submit" className="">Envoyer</button>
                                </div>
                            </div>


                        </form>

                    </div>
                </div>

            </section>
        </main>

    )
};
export default Contact;